import { useEffect, useState } from 'react';
import { fetchCompanies, updateCompanyColors } from './services/api';
import type { CompanyColors } from './types';
import { Loader2, Palette, RefreshCw, Save, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLOR_FIELDS: { key: keyof CompanyColors; label: string; desc: string }[] = [
  { key: 'primary_color', label: 'Cor Primária (Marca)', desc: 'Usada em ícones, detalhes de marca e linhas de separação.' },
  { key: 'secondary_color', label: 'Cor Secundária (Ação)', desc: 'Cor principal dos botões de agendamento e estados ativos.' },
  { key: 'accent', label: 'Cor de Destaque (Accent)', desc: 'Usada para realçar elementos específicos e detalhes de destaque.' },
  { key: 'background', label: 'Cor de Fundo (Página)', desc: 'A cor que fica no fundo de toda a tela do aplicativo.' },
  { key: 'surface', label: 'Cor de Superfície (Cards)', desc: 'Cor do fundo das caixas, como cards de serviços e modais.' },
  { key: 'title', label: 'Cor de Títulos', desc: 'Cor aplicada em H1, H2 e nomes de seções importantes.' },
  { key: 'text_color', label: 'Cor de Texto', desc: 'Cor do texto principal de leitura (preço, descrições).' },
  { key: 'text_dim', label: 'Cor de Texto Esmaecido', desc: 'Texto secundário, mais discreto (ex: "selecione um dia").' },
  { key: 'button_text', label: 'Cor do Texto do Botão', desc: 'Cor das letras dentro dos botões coloridos.' },
  { key: 'form_bg', label: 'Fundo do Formulário', desc: 'Cor do fundo dos campos de entrada de texto e formulários.' },
];

const ColorRow = ({
  label,
  desc,
  value,
  onChange,
  onFocus,
  onBlur
}: {
  label: string;
  desc: string;
  value: string | null;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  const [currentValue, setCurrentValue] = useState(value || '#000000');

  useEffect(() => {
    setCurrentValue(value || '#000000');
  }, [value]);

  const handlePick = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        onChange(result.sRGBHex);
        setCurrentValue(result.sRGBHex);
      } catch (e) {
        console.log('EyeDropper cancelled or failed');
      }
    }
  };

  return (
    <div
      className="flex flex-col py-4 border-b border-slate-100 last:border-0 group focus-within:bg-blue-50/30 transition-colors rounded-xl px-2"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800">{label}</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{currentValue}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentValue}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              onChange(e.target.value);
            }}
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer p-0 overflow-hidden appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
          />
          {'EyeDropper' in window && (
            <button
              onClick={handlePick}
              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              title="Usar conta-gotas"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed italic">{desc}</p>
    </div>
  );
};

const MobilePreview = ({ colors, focusedField }: { colors: Partial<CompanyColors>, focusedField: string | null }) => {
  const [view, setView] = useState<'client' | 'dashboard'>('client');

  const c = {
    bg: colors.background || '#090909',
    surface: colors.surface || '#1a1a1a',
    primary: colors.primary_color || '#007AFF',
    secondary: colors.secondary_color || '#1E90FF',
    accent: colors.accent || '#FFFFFF',
    title: colors.title || '#ffffff',
    text: colors.text_color || '#ffffff',
    textDim: colors.text_dim || 'rgba(255,255,255,0.6)',
    btnText: colors.button_text || '#ffffff',
    form: colors.form_bg || '#262626'
  };

  const getPulsing = (field: string) => focusedField === field ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-transparent animate-pulse z-50 transition-all scale-105" : "";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* View Toggle */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 shadow-inner">
        <button
          onClick={() => setView('client')}
          className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'client' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
        >
          Cliente
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'dashboard' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
        >
          Painel
        </button>
      </div>

      {/* Larger Phone UI */}
      <div
        className={cn(
          "w-[260px] h-[520px] rounded-[52px] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col shrink-0 transition-colors duration-500",
          getPulsing('background')
        )}
        style={{ backgroundColor: c.bg }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-[24px] z-30" />

        {view === 'client' ? (
          <div className="flex-1 p-5 flex flex-col gap-4 pt-10 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className={cn("w-8 h-8 rounded-full shadow-sm", getPulsing('primary_color'))} style={{ backgroundColor: c.primary }} />
              <div className={cn("h-4 w-28 rounded-full", getPulsing('title'))} style={{ backgroundColor: c.title }} />
              <div className="w-8 h-8 rounded-full bg-slate-400/10" />
            </div>

            <div className="mt-4 text-center">
              <h4 className={cn("text-lg font-black leading-tight mb-2 transition-colors", getPulsing('title'))} style={{ color: c.title }}>Nossos Serviços</h4>
              <p className={cn("text-[10px] leading-tight font-medium", getPulsing('text_dim'))} style={{ color: c.textDim }}>Escolha a melhor experiência para você</p>
            </div>

            {/* Service Card Mock */}
            <div className={cn("rounded-3xl p-5 border border-white/5 shadow-2xl transition-all", getPulsing('surface'))} style={{ backgroundColor: c.surface }}>
              <div className="w-full h-32 rounded-2xl mb-4 bg-slate-500/10 flex items-center justify-center">
                <Palette className="w-10 h-10 opacity-5" style={{ color: c.primary }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={cn("text-sm font-black transition-colors", getPulsing('title'))} style={{ color: c.title }}>Assinatura VIP Mensal</span>
                <span className={cn("text-xs font-bold transition-colors", getPulsing('primary_color'))} style={{ color: c.primary }}>R$ 149,90 • Premium</span>
                <p className={cn("text-[10px] leading-relaxed mt-2 opacity-80", getPulsing('text_color'))} style={{ color: c.text }}>Acesso ilimitado aos melhores especialistas com toalha quente.</p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto space-y-3">
              <div className={cn("p-4 h-12 w-full rounded-2xl border border-white/5 flex items-center", getPulsing('form_bg'))} style={{ backgroundColor: c.form }}>
                <div className="h-3 w-32 rounded bg-slate-400/20" />
              </div>
              <button
                className={cn("w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all", getPulsing('secondary_color'), getPulsing('button_text'))}
                style={{ backgroundColor: c.secondary, color: c.btnText }}
              >
                AGENDAR AGORA
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-5 flex flex-col gap-5 pt-10 animate-in fade-in duration-300">
            {/* Dashboard Mock */}
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center transition-all", getPulsing('primary_color'))}>
                <CheckCircle2 className="w-5 h-5" style={{ color: c.primary }} />
              </div>
              <div>
                <h4 className={cn("text-xs font-black uppercase tracking-widest transition-all", getPulsing('title'))} style={{ color: c.title }}>Dashboard</h4>
                <p className={cn("text-[9px] transition-all", getPulsing('text_dim'))} style={{ color: c.textDim }}>Olá, Administrador</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={cn("p-4 rounded-2xl border border-white/5 transition-all", getPulsing('surface'))} style={{ backgroundColor: c.surface }}>
                <span className={cn("text-[9px] font-bold uppercase opacity-50 transition-all", getPulsing('text_dim'))} style={{ color: c.textDim }}>Receita</span>
                <p className={cn("text-sm font-black mt-1 transition-all", getPulsing('title'))} style={{ color: c.title }}>R$ 12.450</p>
              </div>
              <div className={cn("p-4 rounded-2xl border border-white/5 transition-all", getPulsing('surface'))} style={{ backgroundColor: c.surface }}>
                <span className={cn("text-[9px] font-bold uppercase opacity-50 transition-all", getPulsing('text_dim'))} style={{ color: c.textDim }}>Agendamentos</span>
                <p className={cn("text-sm font-black mt-1 transition-all", getPulsing('title'))} style={{ color: c.title }}>142</p>
              </div>
            </div>

            <div className={cn("flex-1 rounded-3xl p-4 border border-white/5 overflow-hidden transition-all", getPulsing('surface'))} style={{ backgroundColor: c.surface }}>
              <div className="flex items-center justify-between mb-4">
                <span className={cn("text-[10px] font-black uppercase transition-all", getPulsing('title'))} style={{ color: c.title }}>Lista VIP</span>
                <div className={cn("w-8 h-2 rounded-full transition-all", getPulsing('accent'))} style={{ backgroundColor: c.accent }} />
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="py-3 border-b border-white/5 last:border-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-400/10" />
                    <div className="h-2 w-16 rounded bg-slate-400/10" />
                  </div>
                  <div className={cn("w-12 h-4 rounded-lg transition-all", getPulsing('secondary_color'))} style={{ backgroundColor: c.secondary }} />
                </div>
              ))}
            </div>

            <div className={cn("h-10 w-full rounded-2xl border border-white/10 flex items-center justify-center transition-all", getPulsing('surface'))} style={{ backgroundColor: c.surface }}>
              <RefreshCw className="w-4 h-4 opacity-20" style={{ color: c.primary }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CompanyListCard = ({
  company,
  onClick
}: {
  company: CompanyColors;
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 text-left transition-all hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 flex flex-col items-center justify-center gap-6"
    >
      <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
        <Palette className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-serif font-black text-slate-900 mb-2">
          {company.company_name || 'Empresa Sem Nome'}
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clique para editar cores</p>
      </div>

      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: company.primary_color || '#ccc' }} />
        <div className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: company.secondary_color || '#ccc' }} />
        <div className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: company.background || '#ccc' }} />
      </div>
    </button>
  );
};

const EditModal = ({
  company,
  onClose,
  onSave
}: {
  company: CompanyColors;
  onClose: () => void;
  onSave: (data: Partial<CompanyColors>) => Promise<void>
}) => {
  const [editedColors, setEditedColors] = useState<Partial<CompanyColors>>(company);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleUpdate = (key: keyof CompanyColors, val: string) => {
    setEditedColors(prev => ({ ...prev, [key]: val }));
    setStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ id: company.id, ...editedColors });
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 1500);
    } catch (e) {
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 lg:p-20">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative bg-white w-full max-w-6xl h-full rounded-[60px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-700">
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-slate-100 bg-white/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-xl shadow-blue-200 rotate-2">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-slate-900 leading-none mb-2">{company.company_name}</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Personalização de Marca v2.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-5 hover:bg-slate-100 rounded-3xl transition-all active:scale-95">
            <RefreshCw className="w-6 h-6 text-slate-400 rotate-45" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 overflow-y-auto px-10 py-10">
              <div className="max-w-2xl space-y-2">
                {COLOR_FIELDS.map(field => (
                  <ColorRow
                    key={field.key}
                    label={field.label}
                    desc={field.desc}
                    value={(editedColors as any)[field.key]}
                    onFocus={() => setFocusedField(field.key)}
                    onBlur={() => setFocusedField(null)}
                    onChange={(val) => handleUpdate(field.key, val)}
                  />
                ))}
              </div>
            </div>

            <div className="w-[400px] bg-slate-50 border-l border-slate-100 hidden lg:flex flex-col items-center justify-center p-12 overflow-y-auto">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Visualização em Tempo Real</span>
              <MobilePreview colors={editedColors} focusedField={focusedField} />

              <button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "w-full mt-10 py-7 rounded-[32px] font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl",
                  status === 'success' ? "bg-emerald-500 text-white shadow-emerald-200" :
                    status === 'error' ? "bg-rose-500 text-white shadow-rose-200" :
                      "bg-slate-900 text-white shadow-slate-300 hover:bg-black hover:-translate-y-1"
                )}
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> :
                  status === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                    status === 'error' ? <AlertCircle className="w-5 h-5" /> :
                      <Save className="w-5 h-5" />}

                {isSaving ? 'Processando...' :
                  status === 'success' ? 'Identidade Salva!' :
                    status === 'error' ? 'Tente Novamente' :
                      'Aplicar Tema'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [companies, setCompanies] = useState<CompanyColors[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<CompanyColors | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompanies();
      if (Array.isArray(data)) {
        setCompanies(data);
        if (data.length === 0) {
          setError('Nenhuma configuração de cor encontrada na API.');
        }
      } else {
        console.error('Data received is not an array:', data);
        setCompanies([]);
        setError('O formato dos dados recebidos é inválido.');
      }
    } catch (e) {
      console.error('Load data error:', e);
      setError('Erro ao carregar empresas. Verifique a API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveColors = async (payload: Partial<CompanyColors>) => {
    const success = await updateCompanyColors(payload);
    if (!success) throw new Error();
    loadData(); // Reload to refresh the list state
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Premium */}
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="container mx-auto px-6 h-28 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-100 rotate-3 p-3 border border-blue-50">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-serif font-black tracking-tight text-slate-900 leading-none">Agenda Atualização</h1>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Central de Design de Marcas</p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="p-5 bg-slate-100 text-slate-600 rounded-[20px] hover:bg-slate-200 transition-all active:scale-95 group"
          >
            <RefreshCw className={cn("w-6 h-6 transition-transform duration-500", loading && "animate-spin")} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-44">
        {loading && companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-16 h-16 border-[6px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Sincronizando Ecossistema...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-12 rounded-[48px] text-center max-w-xl mx-auto shadow-2xl shadow-rose-100">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-rose-900 mb-4">Falha na Sincronização</h2>
            <p className="text-rose-700/60 mb-8 font-medium">{error}</p>
            <button onClick={loadData} className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200">Reconectar</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {(companies || []).map(company => (
              <CompanyListCard
                key={company.id}
                company={company}
                onClick={() => setEditingCompany(company)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Editing Modal */}
      {editingCompany && (
        <EditModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={handleSaveColors}
        />
      )}

      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 bg-slate-900/90 backdrop-blur-xl text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl border border-white/5 z-50">
        Design System Control v2.0
      </footer>
    </div>
  );
}
