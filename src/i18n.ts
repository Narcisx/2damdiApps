import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                translation: {
                    "welcome": "Bienvenido a tu Gestor de Finanzas",
                    "loading": "Cargando...",
                    "auth": {
                        "login_title": "Iniciar Sesión",
                        "register_title": "Crear Cuenta",
                        "email": "Correo Electrónico",
                        "password": "Contraseña",
                        "full_name": "Nombre Completo",
                        "login_button": "Entrar",
                        "register_button": "Registrarse",
                        "register_link": "¿No tienes cuenta? Regístrate",
                        "login_link": "¿Ya tienes cuenta? Inicia sesión",
                        "register_success": "Cuenta creada con éxito. Redirigiendo...",
                        "has_account": "¿Ya tienes cuenta? Inicia sesión"
                    },
                    "nav": {
                        "dashboard": "Panel",
                        "transactions": "Transacciones",
                        "files": "Archivos",
                        "settings": "Configuración",
                        "logout": "Cerrar Sesión"
                    },
                    "dashboard": {
                        "title": "Resumen Financiero",
                        "balance": "Balance Total",
                        "income": "Ingresos",
                        "expense": "Gastos",
                        "recent_transactions": "Transacciones Recientes",
                        "no_transactions": "No hay transacciones recientes"
                    },
                    "transactions": {
                        "title": "Historial de Transacciones",
                        "filter_all": "Todos",
                        "filter_income": "Ingresos",
                        "filter_expense": "Gastos"
                    },
                    "files": {
                        "title": "Mis Archivos",
                        "upload": "Subir Archivo",
                        "uploading": "Subiendo...",
                        "no_files": "No hay archivos subidos",
                        "delete_confirm": "¿Eliminar este archivo?"
                    }
                }
            },
            en: {
                translation: {
                    "welcome": "Welcome to your Finance Manager",
                    "loading": "Loading...",
                }
            }
        },
        lng: "es", // Spanish by default
        fallbackLng: "es",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
