# 📦 Guide d'Installation - QE.tn

## ⚠️ Important : React Router

Cette application nécessite **React Router** pour fonctionner. Si vous rencontrez des erreurs au démarrage, installez-le :

```bash
npm install react-router-dom
```

## 🔧 Installation Complète

### 1. Cloner le projet
```bash
git clone <votre-repo-url>
cd qe-tn
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Vérifier les dépendances critiques

Si vous avez des erreurs, installez manuellement :

```bash
# Router (REQUIS)
npm install react-router-dom

# UI & Styling (normalement déjà installés)
npm install clsx tailwind-merge
npm install lucide-react
npm install motion

# Forms (si nécessaire plus tard)
npm install react-hook-form@7.55.0 zod
```

### 4. Lancer en développement
```bash
npm run dev
```

L'application devrait démarrer sur `http://localhost:5173`

## 🎯 Mode Démo

Par défaut, l'application fonctionne en **mode démo** :
- Connexion avec n'importe quel email/mot de passe
- Données mock générées localement
- Pas besoin de backend

## 🔌 Intégration Backend (Optionnel)

Pour connecter à Supabase et avoir de vraies données :

1. Consulter `/guidelines/Backend-Integration.md`
2. Créer un compte Supabase
3. Configurer les variables d'environnement
4. Exécuter les migrations SQL

## ✅ Vérification

Après installation, vous devriez voir :
1. ✅ Page d'accueil publique sur `/`
2. ✅ Page de connexion sur `/login`
3. ✅ Dashboard après connexion sur `/dashboard`
4. ✅ Thème clair/sombre fonctionnel
5. ✅ Sidebar de navigation

## 🐛 Problèmes Courants

### Erreur : "Cannot find module 'react-router-dom'"
**Solution** : `npm install react-router-dom`

### Erreur : "Cannot find module './contexts'"
**Solution** : Les contexts sont dans `/contexts/`. Vérifiez que tous les fichiers sont présents.

### La page ne charge pas après connexion
**Solution** : Vérifiez la console navigateur. Le problème vient probablement d'un import manquant.

### Le thème ne change pas
**Solution** : Vérifiez que `/styles/globals.css` est bien importé dans votre point d'entrée.

## 📞 Besoin d'Aide ?

Consultez :
- `/README.md` - Documentation générale
- `/guidelines/Code-Quality-Audit.md` - Architecture du code
- `/guidelines/Backend-Integration.md` - Intégration backend

---

**Dernière mise à jour** : Octobre 2025
