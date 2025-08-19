import texture from "@images/texture.png";
interface IProps {
  banner: string;
  caption: React.ReactNode;
  children: React.ReactNode;
}
const PageLayout = ({ banner, caption, children }: IProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${texture})` }}
      className="grid gap-5 lg:grid-cols-2 min-h-full h-full rounded-2xl overflow-hidden backdrop-brightness-150"
    >
      <aside className="relative hidden overflow-hidden lg:block">
        <figure className="reltive rounded-2xl overflow-hidden w-full h-full after:bg-gradient-to-t after:from-background/50 after:to-transparent after:absolute after:bottom-0 after:z-1 after:w-full after:h-1/2 after:rounded-2xl after:overflow-hidden">
          <img
            src={banner}
            alt="Decorative reservation banner"
            role="presentation"
            className="w-full !h-full object-cover"
          />
          <figcaption className="absolute bottom-20 left-20 text-heading-large z-2">
            {caption}
          </figcaption>
        </figure>
      </aside>
      <main className="h-full overflow-hidden">{children}</main>
    </div>
  );
};

export default PageLayout;
