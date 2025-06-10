export const menuItemsPublic = [
  {
    name: "Acesso Sistema",
    hasSubmenu: true,
    subMenuItems: [
      { name: "Criar conta", routePath: "/user-pre" },
      { name: "Fazer login", routePath: "/auth/login" },
      { name: "Recuperar senha", routePath: "/auth/lost-password" },
    ],
  },
  {
    name: "Dúvidas | Ajuda",
    hasSubmenu: true,
    subMenuItems: [
      { name: "Dúvidas Frequentes", routePath: "https://blog.3b3.com.br/", },
      { name: "Suporte Técnico", routePath: "https://3b3.com.br/suporte" },
    ],
  },
  {
    name: "Termos e Acordos",
    hasSubmenu: true,
    subMenuItems: [
      { name: "Política de Privacidade", routePath: "/privacy-policy" },
      { name: "Termos de Serviço", routePath: "/terms-of-service" },
    ],
  },
  {
    name: "Saiba Mais",
    routePath: "https://b3erp.com.br/",
    hasSubmenu: false,
  },
];
