#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🧹 Nettoyage du projet Podomus...\n')

// Fichiers et dossiers à supprimer
const filesToDelete = [
  // Fichiers de sauvegarde et temporaires
  'prisma/schema.prisma.backup',
  'prisma/schema.prisma.temp', 
  'prisma/schema.prisma.original',
  'src/app/admin/patients/page.tsx.bak',
  
  // Fichiers .old (versions obsolètes)
  'src/app/admin/patients/page.old.tsx',
  'src/app/admin/ordre/page.old.tsx', 
  'src/app/admin/dashboard/page.old.tsx',
  
  // Scripts de debug et test obsolètes
  'scripts/check-auth-tables.js',
  'scripts/check.js',
  'scripts/create-admin-better-auth-direct.js',
  'scripts/create-admin-direct.js',
  'scripts/create-admin-solution.js',
  'scripts/create-admin-via-api.js',
  'scripts/create-admin-with-better-auth.js',
  'scripts/debug-auth.js',
  'scripts/debug-final.js',
  'scripts/final-fix.js',
  'scripts/fix-auth.js',
  'scripts/fix-better-auth.js',
  'scripts/inspect-db.js',
  'scripts/test-api-endpoint.js',
  'scripts/test-auth-api.js',
  'scripts/test-auth-login.js',
  'scripts/test-auth.js',
  'scripts/test-custom-auth.js',
  'scripts/test-server-connection.js',
  
  // Fichiers temporaires de migration
  'restore-migration.js',
  'rollback.js',
  'test-prisma.js',
  
  // Images de test et non utilisées
  'public/10.jpg',
  'public/5.jpg',
  'public/6.jpg', 
  'public/7.jpg',
  'public/8.jpg',
  'public/9.jpg',
  'public/a.jpg',
  'public/b.jpg',
  'public/c.jpg',
  'public/old.jpg',
  
  // Dossier de test
  'public/test'
]

// Dossiers à supprimer complètement
const dirsToDelete = [
  '.next', // Cache de build Next.js
  'node_modules', // On le re-génèrera avec npm install
]

let totalSize = 0
let deletedFiles = 0
let deletedDirs = 0

// Fonction pour obtenir la taille d'un fichier
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (err) {
    return 0
  }
}

// Fonction pour obtenir la taille d'un dossier
function getDirSize(dirPath) {
  let size = 0
  try {
    const items = fs.readdirSync(dirPath)
    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const stats = fs.statSync(itemPath)
      if (stats.isDirectory()) {
        size += getDirSize(itemPath)
      } else {
        size += stats.size
      }
    }
  } catch (err) {
    // Ignore errors
  }
  return size
}

// Fonction pour supprimer un dossier récursivement
function deleteDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

// Supprimer les fichiers
console.log('🗑️  Suppression des fichiers inutiles...')
filesToDelete.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    const size = getFileSize(filePath)
    try {
      fs.unlinkSync(filePath)
      totalSize += size
      deletedFiles++
      console.log(`   ✅ ${file} (${(size / 1024).toFixed(1)} KB)`)
    } catch (err) {
      console.log(`   ❌ Erreur lors de la suppression de ${file}: ${err.message}`)
    }
  }
})

// Supprimer les dossiers
console.log('\n📁 Suppression des dossiers cache...')
dirsToDelete.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir)
  if (fs.existsSync(dirPath)) {
    const size = getDirSize(dirPath)
    try {
      deleteDirRecursive(dirPath)
      totalSize += size
      deletedDirs++
      console.log(`   ✅ ${dir}/ (${(size / 1024 / 1024).toFixed(1)} MB)`)
    } catch (err) {
      console.log(`   ❌ Erreur lors de la suppression de ${dir}: ${err.message}`)
    }
  }
})

// Résumé
console.log('\n📊 Résumé du nettoyage:')
console.log(`   📄 Fichiers supprimés: ${deletedFiles}`)
console.log(`   📁 Dossiers supprimés: ${deletedDirs}`)
console.log(`   💾 Espace libéré: ${(totalSize / 1024 / 1024).toFixed(1)} MB`)

console.log('\n🎉 Nettoyage terminé!')
console.log('\n📝 Actions recommandées:')
console.log('   1. Exécuter: npm install (pour re-générer node_modules)')
console.log('   2. Exécuter: npm run build (pour re-générer .next)')
console.log('   3. Vérifier que tout fonctionne: npm run dev')

// Créer un fichier .gitignore optimisé si pas déjà présent
const gitignorePath = path.join(process.cwd(), '.gitignore')
const gitignoreContent = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
/prisma/*.db
/prisma/*.db-journal

# Scripts de test/debug
/scripts/test-*
/scripts/debug-*
/scripts/fix-*
/scripts/check-*
/scripts/create-admin-*

# Fichiers temporaires
*.tmp
*.temp
*.bak
*.backup
*.old
*~

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db`

if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(gitignorePath, gitignoreContent)
  console.log('   4. Fichier .gitignore optimisé créé')
}
