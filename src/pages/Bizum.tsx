import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Send, Search, CheckCircle, Smartphone, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Bizum = () => {
    const navigate = useNavigate();

    // Form and App State
    const [recipientCode, setRecipientCode] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [concept, setConcept] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'confirming' | 'success'>('idle');
    const [recipientName, setRecipientName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setStatus('loading');

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('bizum_code', recipientCode)
                .single();

            if (error || !data) throw new Error('Código Bizum no encontrado.');

            setRecipientName(data.full_name || 'Usuario desconocido');
            setStatus('confirming');

        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Error al buscar usuario');
            setStatus('idle');
        }
    };

    const handleSend = async () => {
        setStatus('loading');
        try {
            const { error } = await supabase.rpc('send_bizum', {
                recipient_code: recipientCode,
                amount: parseFloat(amount),
                currency: currency,
                concept: concept || 'Transferencia'
            });

            if (error) throw error;
            setStatus('success');
            setTimeout(() => navigate('/'), 3000);

        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Error al realizar el Bizum');
            setStatus('confirming');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">¡Envío Realizado!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Has enviado <span className="font-bold text-slate-800 dark:text-white">{amount} {currency}</span> a <span className="font-bold text-indigo-600 dark:text-indigo-400">{recipientName}</span>
                </p>
                <p className="text-slate-400 text-sm mt-8">Redirigiendo al inicio...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Smartphone className="w-8 h-8 text-pink-500" />
                    Bizum
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Envía dinero al instante</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                {status === 'confirming' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                            <p className="text-sm text-slate-500 uppercase tracking-wide font-bold mb-1">Vas a enviar</p>
                            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{amount} {currency}</p>
                            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                                <span>a</span>
                                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{recipientName}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Concepto: {concept || 'Sin concepto'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setStatus('idle')} className="w-full py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
                            <button onClick={handleSend} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><Send className="w-5 h-5" /> Confirmar</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-5">
                        {errorMsg && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-2">
                                <span className="mt-0.5">⚠️</span><span>{errorMsg}</span>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Destinatario</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" value={recipientCode} onChange={(e) => setRecipientCode(e.target.value.toUpperCase())} placeholder="Código Bizum (ej. BZ-1234)" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-mono uppercase text-slate-900 dark:text-white placeholder-slate-400" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Cantidad</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0.01" className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-lg font-bold text-slate-900 dark:text-white placeholder-slate-400" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Divisa</label>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full py-3.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-center text-slate-900 dark:text-white">
                                    <option value="EUR">EUR €</option>
                                    <option value="USD">USD $</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Concepto</label>
                            <input type="text" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Cena, Regalo..." className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400" />
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">{status === 'loading' ? <span className="animate-pulse">Procesando...</span> : <>Continuar <Send className="w-5 h-5" /></>}</button>
                    </form>
                )}
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex gap-3 text-sm text-indigo-800 dark:text-indigo-300">
                <Wallet className="w-5 h-5 flex-shrink-0" />
                <p>El dinero se descontará de tu balance inmediatamente. Si usas otra divisa, se registrará el valor numérico en esa moneda.</p>
            </div>
        </div>
    );
};
export default Bizum;
