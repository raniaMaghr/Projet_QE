# 🏥 QE.tn - Plateforme Éducative Médicale

Plateforme de référence pour les étudiants en médecine tunisiens préparant le résidanat. Entraînez-vous avec des milliers de QCM, suivez votre progression et réussissez vos examens.

![QE.tn](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)

## 🎯 Fonctionnalités

### ✅ Implémentées
- 🏠 **Accueil** - Dashboard avec progression et statistiques
- 📊 **Mes Stats** - Tableaux de bord détaillés avec comparaisons
- ✍️ **QCM** - Interface complète avec surlignage et correction détaillée
- 🔐 **Authentification** - Système de connexion/déconnexion
- 🎨 **Thème** - Mode clair/sombre avec persistance
- 📱 **Responsive** - Design adaptatif mobile/tablette/desktop

### 🚧 En développement
- 📖 Apprendre - Cours J1/J2 par faculté
- 📅 S'organiser - Agenda et répétition espacée
- 🎯 S'entraîner - QCM par séries et à la carte
- 🏆 S'examiner - Examens blancs chronométrés

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

```bash
# Cloner le projet
git clone <votre-repo>
cd qe-tn

# Installer les dépendances
npm install

# Ajouter React Router (si pas déjà installé)
npm install react-router-dom

# Lancer en développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du Projet

```
/
├── components/          # Composants réutilisables
│   ├── common/         # Composants génériques (LoadingSpinner, etc.)
│   ├── layout/         # Header, Sidebar, MainLayout
│   ├── qcm/            # Composants spécifiques aux QCM
│   └── ui/             # Composants Shadcn/UI
├── contexts/           # Contextes React (Auth, Theme)
├── pages/              # Pages de l'application
├── services/           # Services et logique métier
│   └── mock/           # Données mock pour développement
├── types/              # Types TypeScript centralisés
├── styles/             # Styles globaux et tokens CSS
├── utils/              # Utilitaires et helpers
├── guidelines/         # Documentation technique
└── App.tsx             # Point d'entrée (130 lignes !)
```

## 🎨 Design System

### Couleurs Médicales
```css
--medical-blue: #4f7cff    /* Bleu médical principal */
--medical-orange: #ff8f00  /* Orange accent */
--ecg-green: #059669       /* Vert ECG */
--medical-red: #dc2626     /* Rouge médical */
```

### Tokens
Les tokens de design sont définis dans `/styles/globals.css` :
- Typographie (Inter pour UI, Abhaya Libre pour contenu)
- Espacement
- Bordures et ombres
- Transitions

### Composants UI
Bibliothèque Shadcn/UI complète dans `/components/ui/` :
- Buttons, Cards, Dialogs
- Forms, Inputs, Selects
- Tables, Charts, Calendars
- Et plus de 40 composants

## 🔧 Technologies

### Frontend
- **React 18+** - Framework UI
- **TypeScript** - Typage statique
- **React Router** - Routing
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Shadcn/UI** - Composants UI
- **Lucide React** - Icônes
- **Recharts** - Graphiques

### État & Données
- **Context API** - Gestion d'état global
- **localStorage** - Persistance locale
- **Mock Services** - Données de développement

### Backend (À venir)
- **Supabase** - Base de données et authentification
- Guide d'intégration dans `/guidelines/Backend-Integration.md`

## 📖 Guides de Développement

### Conventions de Code
```typescript
// Composants : PascalCase
export function MyComponent() { ... }

// Fichiers : kebab-case
my-component.tsx

// Hooks personnalisés : use prefix
export function useMyHook() { ... }

// Types : .types.ts suffix
my-types.types.ts
```

### Ajouter une Nouvelle Page

1. Créer le composant dans `/pages/`
```typescript
// /pages/NewPage.tsx
export function NewPage() {
  return <div>New Page</div>;
}
```

2. Exporter dans `/pages/index.ts`
```typescript
export * from './NewPage';
```

3. Ajouter la route dans `/App.tsx`
```typescript
<Route path="/new-page" element={<NewPage />} />
```

### Utiliser les Contextes

```typescript
import { useAuth, useTheme } from './contexts';

function MyComponent() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Utilisateur : {user?.fullName}</p>
      <button onClick={toggleTheme}>Changer thème</button>
    </div>
  );
}
```

### Accéder aux Données Mock

```typescript
import { mockUser, mockQuestions, mockSeries } from './services/mock';

function MyComponent() {
  const questions = mockQuestions.filter(q => q.specialite === 'Cardiologie');
  // ...
}
```

## 🧪 Mode Démo

L'application fonctionne actuellement en **mode démo** avec des données mock :
- Connexion : n'importe quel email/mot de passe
- Données : générées localement
- Pas de persistance serveur

Pour activer le backend Supabase, suivez le guide `/guidelines/Backend-Integration.md`

## 📊 Données & Types

### Système Tunisien
- **Niveaux** : J1, J2
- **Facultés** : FMT, FMS, FMM, FMSf
- **Années** : 2022, 2023, 2024, 2025

### Types Principaux
```typescript
// Définis dans /types/

interface User {
  id: string;
  email: string;
  fullName: string;
  faculte: Faculte;
  anneeEtude: AnneeEtude;
  // ...
}

interface Question {
  id: number;
  enonce: string;
  options: Option[];
  typeReponse: 'unique' | 'multiple';
  reponseCorrecte: string[];
  // ...
}

interface CasClinique {
  id: string;
  contenu: string;
  specialite: string;
  questions: number[];
  // ...
}
```

## 🔍 Audit de Qualité

Score global : **6/10 → 9/10** après restructuration ✅

Consultez `/guidelines/Code-Quality-Audit.md` pour les détails.

### Améliorations Récentes
- ✅ App.tsx réduit de 4000+ à 130 lignes
- ✅ Types centralisés dans `/types/`
- ✅ Données mock dans `/services/mock/`
- ✅ Navigation avec React Router
- ✅ Contexts pour auth et theme
- ✅ Composants layout séparés
- ✅ Structure modulaire claire

## 🤝 Contribution

### Workflow
1. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
2. Coder en suivant les conventions
3. Tester localement
4. Commit : `git commit -m "feat: ajout de X"`
5. Push et créer une Pull Request

### Commit Convention
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `refactor:` Refactoring sans changement fonctionnel
- `docs:` Documentation
- `style:` Formatage, styling
- `test:` Tests

## 📝 Licence

Tous droits réservés - QE.tn © 2025

## 🆘 Support

- Documentation : `/guidelines/`
- Issues : Créer une issue sur le repo
- Contact : [À définir]

## 🗺️ Roadmap

### Q1 2025
- [ ] Intégration Supabase complète
- [ ] Système QCM par séries
- [ ] Examens blancs chronométrés
- [ ] Système de badges et gamification

### Q2 2025
- [ ] Module de cours avec PDF
- [ ] Planning intelligent avec répétition espacée
- [ ] Comparaisons anonymes entre étudiants
- [ ] Application mobile (React Native)

### Q3 2025
- [ ] IA de recommandation personnalisée
- [ ] Forum communautaire
- [ ] Lives de révision
- [ ] API publique pour développeurs

---

**Fait avec ❤️ pour les étudiants en médecine tunisiens**

**Version actuelle : 1.0.0** | Dernière mise à jour : Octobre 2025
