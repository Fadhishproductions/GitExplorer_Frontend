export const getRepoIcon = (repo: any): string => {
    const name = repo.name?.toLowerCase() || '';
    const lang = repo.language?.toLowerCase() || '';
  
    const knownIcons = [
      'gitpod',
      'javascript',
      'typescript',
      'react',
      'python',
      'java',
      'html5',
      'css3',
      'nextdotjs',
      'node-dot-js',
      'mongodb',
      'express',
      'vue-dot-js',
      'redux',
    ];
  
    for (const icon of knownIcons) {
      if (name.includes(icon) || lang.includes(icon) || lang === icon) {
        return `https://cdn.simpleicons.org/${icon}`;
      }
    }
  
    // fallback generic repo icon
    return `https://cdn-icons-png.flaticon.com/512/25/25231.png`; // GitHub logo
  };
  