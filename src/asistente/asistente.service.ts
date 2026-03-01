import { Injectable } from '@nestjs/common';

@Injectable()
export class AsistenteService {
    private genAI: any;
    private model: any;
    private isAIReady: boolean = false;

    constructor() {
        this.initializeAI();
    }

    private async initializeAI() {
        try {
            // Intentar cargar la librería dinámicamente para evitar que el servidor se caiga si no está instalada
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const apiKey = process.env.GEMINI_API_KEY;

            if (apiKey && apiKey !== 'tu_api_key_aqui_para_activar_la_ia') {
                this.genAI = new GoogleGenerativeAI(apiKey);
                this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                this.isAIReady = true;
                console.log('✅ Asistente IVI: IA activada correctamente con Gemini.');
            } else {
                console.warn('⚠️ Asistente IVI: Falta la API Key en el .env. Usando modo básico.');
            }
        } catch (error) {
            console.warn('⚠️ Asistente IVI: Librería de Google IA no encontrada. Ejecute: npm install @google/generative-ai');
            this.isAIReady = false;
        }
    }

    async generarRespuesta(pregunta: string, contextoUsuario: any) {
        // Si la IA no está lista o la carga falló, devolvemos null para que el frontend use su respaldo local
        if (!this.isAIReady || !this.model) {
            return null;
        }

        try {
            const prompt = `
        Eres Invi ⚡, el asistente virtual oficial de Invigex, una empresa de tecnología y software.
        
        PERSONALIDAD:
        - Creativa, moderna y cercana, pero siempre profesional.
        - Lenguaje claro, directo y sin tecnicismos innecesarios.
        - Toques de ingenio o metáforas tech naturales (sin forzarlas).
        - Respuestas concisas: evitar párrafos largos.

        OBJETIVO:
        - Ayudar a entender los productos/servicios de Invigex.
        - Resolver dudas sobre funcionalidades, precios, planes o integraciones.
        - Guiar al usuario: contactar ventas, probar demo, leer documentación.
        - Recopilar info inicial para cotizaciones o soporte.

        REGLAS CRÍTICAS:
        1. Solo responder temas de Invigex y tecnología relevante.
        2. Si no sabes algo, di: "déjame conectarte con el equipo de Invigex para darte info exacta" y ofrece contacto (soporte@invigex.com).
        3. No hables de la competencia.
        4. Prioriza empatía si el usuario está frustrado.
        5. Siempre termina con un siguiente paso claro.

        Contexto del usuario:
        - Nombre: ${contextoUsuario.nombre || 'Usuario'}
        - Rol: ${contextoUsuario.rol || 'Visitante'}

        Pregunta del usuario: ${pregunta}
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error en Gemini:', error);
            return null; // El frontend detectará el null y usará su respaldo
        }
    }
}
