export default () => {
  const menu = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
  ];
  return (
    <header class="h-full border-b-2 border-secondary bg-blank">
      <nav class="flex items-center h-full">
        {menu.map((v) => {
          return (
            <a
              class="w-1/4 h-full flex items-center text-lg justify-center transition-all hover:bg-primary hover:text-blank"
              href={v.path}
            >
              {v.name}
            </a>
          );
        })}
      </nav>
    </header>
  );
};
