import { useState } from 'react';
import {
    HelpCircle,
    LayoutDashboard,
    ArrowRightLeft,
    PiggyBank,
    FileText,
    Settings,
    ChevronDown,
    ChevronUp,
    Info,
    Wallet
} from 'lucide-react';

const Help = () => {
    // Accordion State
    const [openSection, setOpenSection] = useState<string | null>('dashboard');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const sections = [
        {
            id: 'dashboard',
            title: 'Panel Principal (Dashboard)',
            icon: <LayoutDashboard className="w-5 h-5 text-indigo-500" />,
            content: (
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                    <p>
                        El <strong>Dashboard</strong> es tu centro de control. Aquí puedes ver un resumen rápido de tu salud financiera.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-indigo-500">
                        <li><strong>Balance Total:</strong> La resta de tus ingresos menos tus gastos.</li>
                        <li><strong>Ingresos y Gastos:</strong> Tarjetas con el total del mes y el porcentaje respecto al volumen total.</li>
                        <li><strong>Gráficos:</strong> Una visión visual de tus movimientos.</li>
                        <li><strong>Actividad Reciente:</strong> Las últimas 5 transacciones para que veas qué ha pasado hoy.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'transactions',
            title: 'Transacciones',
            icon: <ArrowRightLeft className="w-5 h-5 text-emerald-500" />,
            content: (
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                    <p>
                        Aquí es donde registras el día a día. Puedes añadir <strong>Ingresos</strong> (nómina, ventas extra) o <strong>Gastos</strong> (comida, alquiler).
                    </p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
                        <li><strong>Añadir:</strong> Pulsa el botón "+" flotante o "Nueva Transacción".</li>
                        <li><strong>Editar/Borrar:</strong> Pulsa sobre cualquier transacción de la lista para modificarla o eliminarla si te equivocaste.</li>
                        <li><strong>Categorías:</strong> Asigna una categoría (Vivienda, Transporte, Ocio...) para tenerlo todo organizado.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'savings',
            title: 'Ahorro e Inversión',
            icon: <PiggyBank className="w-5 h-5 text-pink-500" />,
            content: (
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                    <p>
                        Esta sección funciona como una <strong>cuenta de ahorro separada</strong>. El dinero que ves aquí está "protegido" de tus gastos diarios.
                    </p>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 my-4">
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Métodos de Ahorro Automático:
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-800 dark:text-indigo-300">
                            <li><strong>Redondeo:</strong> Si gastas 12,50€, la app añade un gasto extra de 0,50€ que va directo a tu hucha. ¡Ahorras sin darte cuenta!</li>
                            <li><strong>Retención:</strong> Cada vez que tienes un Ingreso, la app separa automáticamente un % (ej. 10%) para ahorro.</li>
                        </ul>
                    </div>
                    <p className="mt-2 text-sm italic">
                        Nota: También verás un <strong>Historial de Ahorro</strong> exclusivo con estos movimientos.
                    </p>
                </div>
            )
        },
        {
            id: 'files',
            title: 'Mis Archivos',
            icon: <FileText className="w-5 h-5 text-blue-500" />,
            content: (
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                    <p>
                        Tu caja fuerte de documentos. Guarda aquí facturas importantes, garantías, tickets de compra o contratos.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-blue-500">
                        <li><strong>Subir:</strong> Sube fotos o PDFs desde tu dispositivo.</li>
                        <li><strong>Vincular:</strong> Puedes asociar estos archivos a una transacción concreta para justificar el gasto.</li>
                        <li><strong>Seguridad:</strong> Solo tú puedes acceder a estos documentos (protegidos por tu cuenta).</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'settings',
            title: 'Configuración y Ajustes',
            icon: <Settings className="w-5 h-5 text-slate-500" />,
            content: (
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                    <p>
                        Personaliza la app a tu gusto y gestiona tus datos.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 marker:text-slate-500">
                        <li><strong>Perfil:</strong> Cambia tu nombre para que la app se dirija a ti correctamente.</li>
                        <li><strong>Apariencia:</strong> Alterna entre Modo Claro y Modo Oscuro según prefieras.</li>
                        <li><strong>Seguridad:</strong> Cambia tu contraseña periódicamente.</li>
                        <li><strong>Exportar:</strong> Descarga todas tus transacciones en un archivo Excel (CSV) compatible para hacer tus propios cálculos.</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10 px-4 md:px-0">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
                        <HelpCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Centro de Ayuda
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg leading-relaxed">
                    Bienvenido a la guía completa de tu aplicación. Aquí encontrarás todo lo que necesitas saber para sacarle el máximo partido.
                </p>
            </div>

            <div className="space-y-4">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`
                            bg-white dark:bg-slate-800 rounded-2xl shadow-sm border overflow-hidden transition-all duration-300
                            ${openSection === section.id
                                ? 'border-indigo-500 ring-1 ring-indigo-500/20 shadow-md'
                                : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                            }
                        `}
                    >
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none bg-inherit hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    p-2.5 rounded-xl transition-colors
                                    ${openSection === section.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-700'}
                                `}>
                                    {section.icon}
                                </div>
                                <span className={`font-semibold text-lg ${openSection === section.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                                    {section.title}
                                </span>
                            </div>
                            {openSection === section.id ? (
                                <ChevronUp className="w-5 h-5 text-indigo-500 transition-transform" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" />
                            )}
                        </button>

                        <div
                            className={`
                                overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                                ${openSection === section.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="p-6 pt-2 pl-[5.5rem] pr-6 border-t border-slate-50 dark:border-slate-700/50">
                                <div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start gap-5 shadow-xl shadow-indigo-600/20">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <Info className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-2">¿Necesitas soporte técnico?</h3>
                    <p className="text-indigo-100 leading-relaxed mb-4">
                        Esta aplicación está en constante evolución. Si encuentras algún error o tienes una sugerencia para mejorarla, no dudes en reportarlo.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 backdrop-blur-sm">
                        <span>v1.0.0 (Beta)</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-emerald-300">Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
