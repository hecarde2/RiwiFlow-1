/**
 * login.js
 * Módulo de inicio de sesión
 * (patrón SPA: render + mounted).
 *
 * El HTML/CSS se tomó EXACTAMENTE desde:
 * riwiflow-main/login.html
 *
 * No se realizaron cambios visuales.
 * Solo se agregó la lógica JavaScript
 * para autenticación con json-server.
 */

import { loginUser } from '../services/api.js';
import { saveSession } from '../services/session.js';
import { navigate } from '../router.js';

const Login = {

  /**
   * Renderiza la vista de login
   */
  render() {

    return `
      <main class="flex-grow flex items-center justify-center px-gutter py-xxl min-h-screen">

        <div class="w-full max-w-[440px] space-y-xl">

          <!-- Identidad de marca -->
          <div class="text-center space-y-md">

            <h1 class="font-headline-md text-headline-md font-bold text-primary tracking-tight">
              Riwiflow
            </h1>

            <p class="font-body-md text-body-md text-on-surface-variant">
              Sign in to your professional workspace
            </p>
          </div>

          <!-- Tarjeta login -->
          <div class="bg-surface-container-lowest border border-outline-variant
                      p-xl rounded-xl space-y-lg transition-all">

            <!-- Formulario -->
            <form class="space-y-lg"
                  id="loginForm"
                  onsubmit="return false;">

              <!-- Campo email -->
              <div class="space-y-sm">

                <label class="font-label-md text-label-md text-on-surface"
                       for="email">

                  Email address
                </label>

                <div class="relative">

                  <input
                    class="w-full px-md py-md bg-white border border-outline-variant
                           rounded-lg font-body-md text-body-md text-on-surface
                           input-focus-ring transition-all placeholder:text-outline"

                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email" />
                </div>
              </div>

              <!-- Campo contraseña -->
              <div class="space-y-sm">

                <div class="flex justify-between items-center">

                  <label class="font-label-md text-label-md text-on-surface"
                         for="password">

                    Password
                  </label>

                  <a class="font-label-md text-label-md text-primary
                            hover:underline transition-all"
                     href="#">

                    Forgot password?
                  </a>
                </div>

                <div class="relative">

                  <input
                    class="w-full px-md py-md bg-white border border-outline-variant
                           rounded-lg font-body-md text-body-md text-on-surface
                           input-focus-ring transition-all placeholder:text-outline"

                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password" />
                </div>
              </div>

              <!-- Botón principal -->
              <div class="pt-sm">

                <button
                  class="w-full bg-primary hover:bg-primary-container
                         text-on-primary font-label-md text-label-md
                         py-md px-lg rounded-lg transition-all
                         active:scale-[0.98] duration-150
                         flex items-center justify-center gap-sm"

                  id="btn-login"
                  type="submit">

                  Login

                  <span class="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>

              <!-- Mensaje de error -->
              <div id="login-error"
                   class="hidden text-error font-body-sm text-body-sm text-center
                          bg-error-container rounded-lg px-md py-sm">

                Invalid email or password.
              </div>
            </form>

            <!-- Separador -->
            <div class="relative py-sm">

              <div class="absolute inset-0 flex items-center">

                <div class="w-full border-t border-outline-variant"></div>
              </div>

              <div class="relative flex justify-center text-label-sm">

                <span class="bg-surface-container-lowest px-md text-outline
                             font-label-sm uppercase tracking-widest">

                  or continue with
                </span>
              </div>
            </div>

            <!-- Acciones secundarias -->
            <div class="grid grid-cols-1 gap-md">

              <button class="w-full flex items-center justify-center gap-md py-md
                             border border-outline-variant rounded-lg
                             font-label-md text-label-md text-on-surface
                             hover:bg-surface-container-low transition-colors duration-200">

                <img
                  alt="Google"
                  class="w-4 h-4 opacity-80"

                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4MKWoYfBIsxFaqncSN9YxR9mdXQGZNMC1EJDT5yAh5A5R7NXO24MRfA2bF0BxpLFdOJLIlAof80HOr4HokeP6RalmMOUP2rfQdl3XiQ4NoHX37q7XV75Y8mHyjT-0PziGdPkI9qXCMmNzMVVN-ZQUdWwMo6nYIE9qAI22sos0F8nFKx2zlwN1HYzEky_3nI6UP8FAT6bwNH0p2-0Yi3teyjDUPvFHOJwCiAgh-b14qx97Qfr8mlseGFe9mamhHBn8i9WZVkS0Zdjc" />

                Sign in with Google
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center">

            <p class="font-body-sm text-body-sm text-on-surface-variant">

              Don't have an account?

              <a class="text-primary font-label-md hover:underline"
                 href="#">

                Create an account
              </a>
            </p>
          </div>
        </div>
      </main>

      <!-- Fondo decorativo -->
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

        <div class="absolute top-[-10%] right-[-10%]
                    w-[40%] h-[40%]
                    bg-primary-fixed/20 blur-[120px]
                    rounded-full"></div>

        <div class="absolute bottom-[-10%] left-[-10%]
                    w-[30%] h-[30%]
                    bg-primary-fixed/10 blur-[100px]
                    rounded-full"></div>
      </div>`;
  },

  /**
   * Se ejecuta después de renderizar
   */
  mounted() {

    // Elementos DOM
    const form =
      document.getElementById('loginForm');

    const btnLogin =
      document.getElementById('btn-login');

    const errorEl =
      document.getElementById('login-error');

    /**
     * Evento submit del login
     */
    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      // Obtiene datos
      const email =
        document.getElementById('email')
          .value.trim();

      const password =
        document.getElementById('password')
          .value.trim();

      /**
       * Estado de carga
       */
      const originalContent =
        btnLogin.innerHTML;

      btnLogin.disabled = true;

      btnLogin.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white"
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24">

          <circle class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"></circle>

          <path class="opacity-75"
                fill="currentColor"

                d="M4 12a8 8 0 018-8V0
                   C5.373 0 0 5.373 0 12h4zm2 5.291
                   A7.962 7.962 0 014 12H0
                   c0 3.042 1.135 5.824
                   3 7.938l3-2.647z">

          </path>
        </svg>

        Verifying...`;

      try {

        // Intenta iniciar sesión
        const user =
          await loginUser(email, password);

        /**
         * Usuario inválido
         */
        if (!user) {

          errorEl.classList.remove('hidden');

          setTimeout(() => {
            errorEl.classList.add('hidden');
          }, 3000);

          // Restaura botón
          btnLogin.innerHTML = originalContent;

          btnLogin.disabled = false;

          return;
        }

        /**
         * Guarda sesión
         */
        saveSession(user);

        /**
         * Estado éxito
         */
        btnLogin.innerHTML = `
          <span class="material-symbols-outlined">
            check_circle
          </span>

          Welcome!`;

        // Cambia color botón
        btnLogin.classList.replace(
          'bg-primary',
          'bg-green-600'
        );

        /**
         * Navega al board
         */
        setTimeout(() => {

          navigate('/board');

        }, 800);

      } catch (err) {

        // Error conexión servidor
        console.error('Login error:', err);

        errorEl.textContent =
          'Cannot connect to server. Make sure json-server is running.';

        errorEl.classList.remove('hidden');

        setTimeout(() => {
          errorEl.classList.add('hidden');
        }, 4000);

        // Restaura botón
        btnLogin.innerHTML = originalContent;

        btnLogin.disabled = false;
      }
    });
  },
};

// Exporta módulo login
export default Login;