# 🔍 Audit Qualité du Code - QE.tn

## 📋 Score Global

| Catégorie | Score | Commentaire |
|-----------|-------|-------------|
| 🧱 Structure & Organisation | ⚠️ 6/10 | Besoin d'amélioration importante |
| 🧠 Données & Logique | ⚠️ 5/10 | Centralisation nécessaire |
| 🎨 UI/UX | ✅ 9/10 | Excellent design system |
| ⚙️ Performance | ⚠️ 6/10 | Optimisations possibles |
| 🔐 Sécurité | ⚠️ 7/10 | Bonnes bases, améliorer |
| 🧩 Collaboration | ❌ 3/10 | Documentation manquante |

**Score total : 6/10** - Bon potentiel, mais nécessite restructuration avant backend.

---

## 🧱 1. STRUCTURE & ORGANISATION

### ❌ Problèmes critiques

#### 1.1 App.tsx monolithique (>3000 lignes)
**Problème :** Tout le code de navigation, routing, et gestion d'état est dans `/App.tsx`

```typescript
// ❌ ACTUEL : App.tsx contient TOUT
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [currentView, setCurrentView] = useState("");
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("j1");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ... +30 autres états
  // ... +500 lignes de JSX inline
}
```

**Impact :** 
- 🔴 Impossible à maintenir
- 🔴 Re-renders inutiles de toute l'app
- 🔴 Difficile pour un dev backend de comprendre le flux

#### 1.2 Pas de structure de dossiers claire

```
❌ ACTUEL:
/components
  - SimpleHomePage.tsx
  - SimpleLoginPage.tsx
  - StatsPage.tsx
  - Logo.tsx
  - ECGPattern.tsx
  /qcm
    - QCMPage.tsx
  /ui
    - (shadcn components)
```

```
✅ RECOMMANDÉ:
/src
  /components
    /layout          # Header, Sidebar, Footer
    /common          # Logo, ECGPattern, LoadingSpinner
    /ui              # shadcn components
  /features
    /auth            # Login, Register, AuthContext
    /dashboard       # Dashboard components
    /qcm             # QCM components
    /stats           # Stats components
    /planning        # Planning/Calendar components
    /courses         # Courses components
  /pages             # Page wrappers
  /services          # API calls (qcmService, authService)
  /hooks             # Custom hooks
  /utils             # Helper functions
  /types             # TypeScript interfaces
  /constants         # Config, routes, colors
```

#### 1.3 Pas de routing library

**Problème :** Navigation gérée manuellement avec états

```typescript
// ❌ ACTUEL
const [currentPage, setCurrentPage] = useState("home");
const [currentSection, setCurrentSection] = useState("dashboard");
const [currentView, setCurrentView] = useState("");

// Logique de navigation complexe dans le JSX
{currentPage === "login" && <SimpleLoginPage />}
{currentPage === "app" && currentSection === "dashboard" && ...}
```

**Solution :** Utiliser React Router

```typescript
// ✅ RECOMMANDÉ
// /App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/qcm" element={<QCMPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/planning" element={<PlanningPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

#### 1.4 Types non centralisés

**Problème :** Interfaces dupliquées dans chaque fichier

```typescript
// ❌ Dans QCMPage.tsx
interface Question { ... }
interface CasClinique { ... }

// ❌ Dans StatsPage.tsx
// Mêmes interfaces redéfinies
```

**Solution :** Types centralisés

```typescript
// ✅ /types/qcm.types.ts
export interface Question {
  id: number;
  casCliniqueId: string;
  numero: number;
  enonce: string;
  options: Option[];
  typeReponse: "unique" | "multiple";
  reponseCorrecte: string[];
  explication: string;
  specialite: string;
  tags: string[];
}

export interface CasClinique {
  id: string;
  numero: number;
  contenu: string;
  specialite: string;
  questions: number[];
}

// ✅ /types/user.types.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  faculte: Faculte;
  anneeEtude: AnneeEtude;
}

// ✅ /types/index.ts
export * from './qcm.types';
export * from './user.types';
export * from './stats.types';
```

---

## 🧠 2. DONNÉES & LOGIQUE

### ❌ Problèmes critiques

#### 2.1 Données mock éparpillées

```typescript
// ❌ Dans App.tsx
const mockSeries = [
  { id: "serie_1", titre: "2024 - FMT", ... },
  // ...
];

// ❌ Dans QCMPage.tsx
const mockCasClinique = { ... };
const mockQuestions = [ ... ];

// ❌ Dans StatsPage.tsx
const mockProgressData = [ ... ];
```

**Solution :** Centraliser les données mock

```typescript
// ✅ /services/mock/qcm.mock.ts
export const mockCasCliniques: CasClinique[] = [ ... ];
export const mockQuestions: Question[] = [ ... ];
export const mockSeries: Serie[] = [ ... ];

// ✅ /services/mock/user.mock.ts
export const mockUser: User = { ... };
export const mockProgress: UserProgress[] = [ ... ];

// ✅ /services/mock/index.ts
export * from './qcm.mock';
export * from './user.mock';
```

#### 2.2 Pas d'abstraction API

**Problème :** Données hardcodées dans les composants, impossible de switcher vers une vraie API facilement

**Solution :** Service layer avec interface commune

```typescript
// ✅ /services/api/qcm.service.ts
interface QCMService {
  getCasCliniques(filters: QCMFilters): Promise<CasClinique[]>;
  getQuestions(casId: string): Promise<Question[]>;
  getSeries(level: string): Promise<Serie[]>;
  submitAnswer(answer: UserAnswer): Promise<AnswerResult>;
}

// ✅ Version Mock (développement)
export class MockQCMService implements QCMService {
  async getCasCliniques(filters: QCMFilters) {
    // Retourne les données mock
    return mockCasCliniques.filter(c => 
      !filters.specialite || c.specialite === filters.specialite
    );
  }
}

// ✅ Version Supabase (production)
export class SupabaseQCMService implements QCMService {
  async getCasCliniques(filters: QCMFilters) {
    const { data } = await supabase
      .from('cas_cliniques')
      .select('*')
      .match(filters);
    return data;
  }
}

// ✅ /services/api/index.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const qcmService: QCMService = USE_MOCK 
  ? new MockQCMService() 
  : new SupabaseQCMService();
```

#### 2.3 Pas de gestion d'état global

**Problème :** Props drilling massif, état partagé difficile

```typescript
// ❌ ACTUEL : 30+ états dans App.tsx passés à tous les composants
<QCMPage 
  filters={filters} 
  theme={theme} 
  user={user}
  onFilterChange={...}
  // ... 20 autres props
/>
```

**Solution :** Context API ou Zustand

```typescript
// ✅ /contexts/AuthContext.tsx
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ✅ /store/theme.store.ts (Zustand)
import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}));

// ✅ Utilisation dans composants
function Header() {
  const { theme, toggleTheme } = useThemeStore();
  // Plus besoin de props!
}
```

#### 2.4 Pas de gestion d'erreurs

```typescript
// ❌ Pas de try/catch, pas d'états error/loading
const data = await fetchData(); // Que se passe-t-il si ça fail?
```

**Solution :** Pattern standard

```typescript
// ✅ /hooks/useQCM.ts
export function useQCM(filters: QCMFilters) {
  const [data, setData] = useState<CasClinique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await qcmService.getCasCliniques(filters);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  return { data, loading, error, refetch: fetchData };
}

// ✅ Utilisation
function QCMPage() {
  const { data, loading, error } = useQCM({ specialite: 'Cardiologie' });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <QCMContent data={data} />;
}
```

---

## 🎨 3. UI/UX & COMPOSANTS

### ✅ Points forts

- ✅ Design system cohérent (globals.css avec tokens)
- ✅ Palette de couleurs médicales bien définie
- ✅ Components Shadcn/UI bien intégrés
- ✅ Animations Motion fluides
- ✅ Responsive design

### ⚠️ Améliorations nécessaires

#### 3.1 Composants trop gros

```typescript
// ❌ QCMPage.tsx = 800+ lignes
// Mélange UI, logique, navigation, état

// ✅ RECOMMANDÉ : Découper
/features/qcm
  - QCMPage.tsx          # Container (200 lignes)
  - CasCliniqueCard.tsx  # Affichage cas (100 lignes)
  - QuestionCard.tsx     # Affichage question (150 lignes)
  - QCMNavigation.tsx    # Barre navigation (100 lignes)
  - QCMTimer.tsx         # Timer (50 lignes)
  - QCMFilters.tsx       # Filtres (100 lignes)
  - HighlightTools.tsx   # Outils surlignage (80 lignes)
  - useQCMState.ts       # Hook custom logique (150 lignes)
```

#### 3.2 Manque de composants réutilisables

**Créer des composants génériques :**

```typescript
// ✅ /components/common/LoadingSpinner.tsx
export function LoadingSpinner({ size = 'md', message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader className={sizeClasses[size]} />
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

// ✅ /components/common/ErrorMessage.tsx
export function ErrorMessage({ error, retry }: Props) {
  return (
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
        <p className="text-center mt-2">{error.message}</p>
        {retry && (
          <Button onClick={retry} variant="outline" className="mt-4">
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ✅ /components/common/EmptyState.tsx
export function EmptyState({ icon: Icon, message, action }: Props) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground" />
      <p className="mt-4 text-muted-foreground">{message}</p>
      {action && <Button className="mt-4">{action}</Button>}
    </div>
  );
}
```

#### 3.3 Validation des formulaires manquante

```typescript
// ❌ ACTUEL : Pas de validation
<Input 
  value={email} 
  onChange={(e) => setEmail(e.target.value)} 
/>
<Button onClick={login}>Connexion</Button>

// ✅ RECOMMANDÉ : React Hook Form + Zod
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Min 8 caractères'),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await authService.login(data);
    } catch (error) {
      form.setError('root', { message: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... */}
      </form>
    </Form>
  );
}
```

---

## ⚙️ 4. PERFORMANCE

### ⚠️ Problèmes identifiés

#### 4.1 Re-renders inutiles

```typescript
// ❌ App.tsx : Tout l'état dans un seul composant
// Changer le theme re-render TOUTE l'app

// ✅ Memoization
import { memo, useMemo, useCallback } from 'react';

export const QCMQuestion = memo(({ question, onAnswer }: Props) => {
  // Ce composant ne re-render que si question ou onAnswer change
  return <div>{question.enonce}</div>;
});

// ✅ Callbacks stables
function QCMPage() {
  const handleAnswer = useCallback((answer: string[]) => {
    submitAnswer(currentQuestionId, answer);
  }, [currentQuestionId]); // Ne change que si currentQuestionId change
  
  return <QCMQuestion onAnswer={handleAnswer} />;
}
```

#### 4.2 Pas de lazy loading

```typescript
// ❌ ACTUEL : Tout chargé au démarrage
import QCMPage from './components/qcm/QCMPage';
import StatsPage from './components/StatsPage';

// ✅ RECOMMANDÉ : Lazy loading
import { lazy, Suspense } from 'react';

const QCMPage = lazy(() => import('./features/qcm/QCMPage'));
const StatsPage = lazy(() => import('./features/stats/StatsPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/qcm" element={<QCMPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Suspense>
  );
}
```

#### 4.3 Images non optimisées

```typescript
// ✅ Ajouter lazy loading images
export function ImageWithFallback({ src, alt, ...props }: Props) {
  return (
    <img 
      src={src} 
      alt={alt} 
      loading="lazy"  // ← Ajouter
      {...props} 
    />
  );
}
```

---

## 🔐 5. SÉCURITÉ

### ⚠️ Points d'attention

#### 5.1 Secrets exposés

```typescript
// ⚠️ /utils/supabase/info.tsx
export const projectId = "rhbxaluwjrwditkjebxi"
export const publicAnonKey = "eyJhbGci..." // OK si anon key, mais...

// ✅ RECOMMANDÉ : .env
// .env
VITE_SUPABASE_URL=https://rhbxaluwjrwditkjebxi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

// /utils/supabase/client.ts
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// .gitignore
.env
.env.local
```

#### 5.2 Validation input

```typescript
// ❌ Pas de validation des inputs utilisateur
const handleSubmit = () => {
  api.post('/answer', { answer: userInput }); // Dangereux
};

// ✅ Toujours valider
import DOMPurify from 'dompurify';

const handleSubmit = () => {
  const sanitized = DOMPurify.sanitize(userInput);
  const validated = answerSchema.parse({ answer: sanitized });
  api.post('/answer', validated);
};
```

#### 5.3 Routes protégées

```typescript
// ✅ /components/layout/ProtectedRoute.tsx
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

// ✅ Utilisation
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/qcm" element={<QCMPage />} />
</Route>
```

---

## 🧩 6. COLLABORATION & MAINTENANCE

### ❌ Problèmes critiques

#### 6.1 Pas de README

```markdown
# ✅ Créer /README.md

# QE.tn - Plateforme Éducative Médicale

Plateforme pour étudiants en médecine tunisiens avec QCM, cours, et suivi de progression.

## 🚀 Installation

```bash
npm install
npm run dev
```

## 📁 Structure

```
/src
  /components     # Composants UI réutilisables
  /features       # Fonctionnalités par module
  /services       # API et services
  /utils          # Utilitaires
  /types          # Types TypeScript
```

## 🔧 Configuration

1. Copier `.env.example` vers `.env`
2. Renseigner les variables Supabase
3. Lancer `npm run dev`

## 🎨 Design System

- Couleurs: `styles/globals.css`
- Composants UI: Shadcn/UI
- Icônes: Lucide React
- Animations: Motion

## 📝 Conventions

- Components: PascalCase
- Files: kebab-case
- Hooks: use prefix
- Types: .types.ts suffix

## 🧪 Tests (à venir)

```bash
npm run test
```

## 📦 Build

```bash
npm run build
```
```

#### 6.2 Pas de linter config

```json
// ✅ .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}

// ✅ .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}

// ✅ package.json scripts
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

#### 6.3 Pas de commentaires JSDoc

```typescript
// ✅ Documenter les fonctions complexes
/**
 * Calcule le score de maîtrise d'une spécialité
 * @param correctAnswers - Nombre de réponses correctes
 * @param totalAnswers - Nombre total de réponses
 * @param avgTimePerQuestion - Temps moyen par question en secondes
 * @returns Score entre 0 et 1
 */
export function calculateMasteryScore(
  correctAnswers: number,
  totalAnswers: number,
  avgTimePerQuestion: number
): number {
  const accuracy = correctAnswers / totalAnswers;
  const speedFactor = Math.max(0, 1 - (avgTimePerQuestion - 60) / 120);
  return accuracy * 0.7 + speedFactor * 0.3;
}
```

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### Phase 1: Restructuration critique (1-2 jours)

#### ✅ Tâches à faire AVANT l'intégration backend

1. **Créer la structure de dossiers**
   ```bash
   mkdir -p src/{components/{layout,common},features/{auth,qcm,stats,dashboard},services/{api,mock},hooks,types,constants,utils}
   ```

2. **Extraire les types**
   - Créer `/types/qcm.types.ts`
   - Créer `/types/user.types.ts`
   - Créer `/types/stats.types.ts`
   - Créer `/types/index.ts`

3. **Centraliser les données mock**
   - Créer `/services/mock/qcm.mock.ts`
   - Créer `/services/mock/user.mock.ts`
   - Supprimer les données hardcodées dans les composants

4. **Installer React Router**
   ```bash
   npm install react-router-dom
   ```

5. **Découper App.tsx**
   - Créer `/pages/HomePage.tsx`
   - Créer `/pages/LoginPage.tsx`
   - Créer `/pages/DashboardPage.tsx`
   - Créer `/components/layout/MainLayout.tsx`
   - Créer `/components/layout/Header.tsx`
   - Créer `/components/layout/Sidebar.tsx`
   - Refactorer App.tsx en Router (< 100 lignes)

6. **Créer les contexts**
   - `/contexts/AuthContext.tsx`
   - `/contexts/ThemeContext.tsx`

### Phase 2: Service Layer (1 jour)

7. **Créer l'abstraction API**
   - `/services/api/qcm.service.ts` (interface + mock)
   - `/services/api/auth.service.ts`
   - `/services/api/stats.service.ts`
   - `/services/api/index.ts`

8. **Créer les custom hooks**
   - `/hooks/useQCM.ts`
   - `/hooks/useAuth.ts`
   - `/hooks/useStats.ts`

### Phase 3: Qualité (1 jour)

9. **Configuration outils**
   - Créer `.eslintrc.json`
   - Créer `.prettierrc`
   - Créer `.env.example`
   - Ajouter scripts lint/format

10. **Documentation**
    - Créer `README.md`
    - Créer `CONTRIBUTING.md`
    - Ajouter JSDoc sur fonctions principales

11. **Optimisations**
    - Ajouter lazy loading routes
    - Ajouter memo sur composants lourds
    - Ajouter loading states partout

### Phase 4: Préparation backend (inclus)

12. **Suivre le guide Backend-Integration.md**

---

## 📊 COMPARAISON AVANT/APRÈS

### AVANT (État actuel)

```
❌ App.tsx : 3000+ lignes
❌ 30+ états dans un seul composant
❌ Navigation manuelle fragile
❌ Données hardcodées partout
❌ Pas de gestion d'erreurs
❌ Pas de documentation
❌ Impossible pour un dev backend de s'y retrouver
```

### APRÈS (Recommandé)

```
✅ App.tsx : <100 lignes (Router uniquement)
✅ État distribué (Contexts + Zustand)
✅ React Router + routes protégées
✅ Service layer avec interface claire
✅ try/catch + loading/error states partout
✅ README + JSDoc + ESLint
✅ Architecture claire pour backend dev
```

---

## 🎓 RESSOURCES POUR AMÉLIORATION

### Articles
- [React Folder Structure](https://www.robinwieruch.de/react-folder-structure/)
- [Clean Code React](https://dev.to/thawkin3/clean-code-for-react-3n4g)
- [React Performance Optimization](https://kentcdodds.com/blog/usememo-and-usecallback)

### Librairies recommandées
```bash
npm install react-router-dom zustand zod react-hook-form@7.55.0
npm install -D eslint prettier @typescript-eslint/eslint-plugin
```

---

## 💡 CONCLUSION

**Le projet a un excellent potentiel UI/UX** mais nécessite une **restructuration importante** avant d'intégrer le backend.

### ⚠️ Risques actuels :
- Impossible à maintenir à long terme
- Difficile pour un nouveau dev de contribuer
- Bug-prone (pas de validation, pas d'error handling)
- Performance dégradée (re-renders massifs)

### ✅ Après restructuration :
- Code maintenable et scalable
- Facile pour backend dev de comprendre et intégrer
- Architecture professionnelle
- Prêt pour la production

**Estimation temps restructuration : 3-4 jours**  
**ROI : Économie de semaines de dette technique future**

---

## 🚦 RECOMMANDATION FINALE

**🔴 NE PAS intégrer le backend dans l'état actuel**

**🟢 FAIRE d'abord la restructuration (Phase 1-3)**

**🟢 PUIS suivre le guide Backend-Integration.md**

Cela vous évitera des mois de dette technique et facilitera grandement le travail du développeur backend.
