# Guide - Activer/Desactiver la creation de scripts

Ce guide explique comment piloter la fonctionnalite de creation de scripts via le fichier
`public/plugin-config.json`.

Important : ce fichier fait partie du package de l'extension. Le changement est donc
pris en compte a la prochaine version/deploiement de l'extension (ce n'est pas un
endpoint distant a proprement parler).

## Ou modifier la configuration

Fichier : `public/plugin-config.json`

Contenu actuel attendu (exemple) :

```json
{
  "features": {
    "scriptCreation": {
      "enabled": true,
      "hideToggle": false
    }
  }
}
```

## Signification des champs

- `features.scriptCreation.enabled`
  - `true` : la creation de scripts est autorisee.
  - `false` : la creation de scripts est desactivee.

- `features.scriptCreation.hideToggle`
  - `false` : le switch reste visible dans les parametres.
  - `true` : le switch est cache aux utilisateurs.

## Comportement dans l'UI

- Si `enabled=false` :
  - Le menu "Enregistrer" n'apparait pas en bas.
  - Le switch utilisateur est grise (desactive) s'il est visible.

- Si `enabled=true` :
  - Le menu "Enregistrer" apparait en bas (si l'utilisateur a aussi active le switch local).

- Si `hideToggle=true` :
  - Le switch n'apparait pas dans les parametres.

## Scenarios recommandés

1. Desactiver et cacher la fonctionnalite

```json
{
  "features": {
    "scriptCreation": {
      "enabled": false,
      "hideToggle": true
    }
  }
}
```

2. Desactiver mais laisser visible

```json
{
  "features": {
    "scriptCreation": {
      "enabled": false,
      "hideToggle": false
    }
  }
}
```

3. Activer et laisser visible

```json
{
  "features": {
    "scriptCreation": {
      "enabled": true,
      "hideToggle": false
    }
  }
}
```

## Notes de deploiement

- Toute modification de `public/plugin-config.json` necessite de re-packager et
  de re-deployer l'extension pour etre effective chez les utilisateurs.
- Si un comportement "a distance" est requis sans re-deploiement, il faudra
  remplacer cette source locale par un endpoint distant (non couvert ici).
