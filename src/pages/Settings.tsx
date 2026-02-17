import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Lock, Download } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();

    // State for Profile
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // State for Bizum Code
    const [bizumCode, setBizumCode] = useState<string>('Cargando...');

    // State for Dark Mode
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Fetch Bizum Code
    useEffect(() => {
        const fetchBizumCode = async () => {
            if (!user) return;
            const { data } = await supabase.from('profiles').select('bizum_code').eq('id', user.id).single();
            if (data) setBizumCode(data.bizum_code);
            else setBizumCode('No disponible');
        };
        fetchBizumCode();
    }, [user]);

    // Update Profile Handler
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        setMsg({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;
            setMsg({ type: 'success', text: 'Perfil actualizado correctamente' });
            window.location.reload();

        } catch (error: any) {
            setMsg({ type: 'error', text: error.message });
        } finally {
            setLoadingProfile(false);
        }
    };

    // Export Data Handler
    const handleExportData = async () => {
        try {
            const { transactionService } = await import('../services/transactionService');
            const transactions = await transactionService.getTransactions();

            if (!transactions || transactions.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

            const BOM = "\uFEFF";
            const SEP = ";";
            const headers = ['Fecha', 'Hora', 'Concepto', 'Cantidad', 'Tipo', 'Categoría', 'Moneda'];

            const rows = transactions.map(t => {
                const dateObj = new Date(t.date);
                const dateStr = dateObj.toLocaleDateString('es-ES');
                const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                const cleanDesc = t.description ? t.description.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""') : "";
                const amountStr = t.amount.toString().replace('.', ',');
                const typeStr = t.category?.type === 'income' ? 'Ingreso' : 'Gasto';
                const catStr = t.category?.name || 'Sin categoría';
                const currStr = t.currency || 'EUR';

                return [
                    dateStr,
                    timeStr,
                    `"${cleanDesc}"`,
                    amountStr,
                    typeStr,
                    `"${catStr}"`,
                    currStr
                ].join(SEP);
            });

            const csvContent = BOM + [
                headers.join(SEP),
                ...rows
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `Mis_Finanzas_Bizum_${new Date().toISOString().slice(0, 10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error al exportar datos');
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('nav.settings')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gestiona tus preferencias y cuenta</p>
            </div>

            {/* Appearance Section */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">Apariencia</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-yellow-100 text-yellow-600'}`}>
                            {darkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Modo Oscuro</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cambia la apariencia de la aplicación</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>
            </section>

            {/* Personal Data Section */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">Datos Personales</h2>

                {/* Bizum Code Display */}
                <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/10 dark:to-orange-900/10 rounded-xl border border-pink-100 dark:border-pink-900/30 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide font-bold text-pink-600 dark:text-pink-400 mb-1">Tu Código Bizum</p>
                        <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-wider">{bizumCode}</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <span className="text-2xl">📲</span>
                    </div>
                </div>

                {msg.text && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                            />
                            <button
                                type="submit"
                                disabled={loadingProfile}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {loadingProfile ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                        <input
                            type="text"
                            value={user?.email || ''}
                            disabled
                            className="w-full rounded-lg border-gray-200 bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 shadow-sm py-2 px-3 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">El correo no se puede cambiar.</p>
                    </div>
                </form>
            </section>

            {/* Security Section */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">Seguridad</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Contraseña</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Se recomienda cambiarla periódicamente</p>
                    </div>
                    <Link
                        to="/update-password"
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium text-sm flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg transition-colors"
                    >
                        <Lock className="w-4 h-4" /> Cambiar Contraseña
                    </Link>
                </div>
            </section>

            {/* Data Section */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">Mis Datos</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Exportar Transacciones</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Descarga todo tu historial en formato CSV (Excel)</p>
                    </div>
                    <button
                        onClick={handleExportData}
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium text-sm flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-900"
                    >
                        <Download className="w-4 h-4" /> Descargar CSV
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Settings;
