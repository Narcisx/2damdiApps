import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Determine redirect URL based on environment (localhost vs production/apk)
            // For Capacitor/APK, deep linking setup is ideally needed, but for now we rely on basic web reset flow.
            // If running as PWA/Web, window.location.origin is fine.
            const redirectTo = `${window.location.origin}/update-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="p-8">
                    <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al inicio
                    </Link>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Recuperar Contraseña</h2>
                    <p className="text-slate-500 text-sm mb-8">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

                    {success ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-emerald-900 mb-1">¡Correo enviado!</h3>
                            <p className="text-emerald-700 text-sm">Revisa tu bandeja de entrada (y spam) para continuar.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 'Enviar enlace'}
                                {!loading && <ArrowRight className="h-5 w-5" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
