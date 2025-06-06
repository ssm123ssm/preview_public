export function Footer() {
  return (
    <footer className=" bg-white px-6 w-full mx-auto pt-6 border-t border-[#EEEEF0] flex justify-between pb-24">
      <a
        href="https://github.com/ssm123ssm/preview_public"
        target="_blank"
        className="flex gap-2 font-medium text-[0.8125rem] items-center"
      >
        Preview
        <span className="text-[#5E5F6E]">{new Date().getFullYear()}</span>
      </a>
      <ul className="flex gap-2 ml-auto">
        <li className="gap-4 flex">
          <a
            href="https://github.com/ssm123ssm"
            target="_blank"
            className="flex items-center gap-2 font-medium text-[0.8125rem] rounded-full px-3 py-2 hover:bg-gray-100"
          >
            Supun Manathunga{" "}
            <img
              src="/avatar.jpeg"
              alt="Supun Manathunga"
              width={24}
              height={24}
              className="rounded-full"
            />
          </a>
        </li>
      </ul>
    </footer>
  );
}
