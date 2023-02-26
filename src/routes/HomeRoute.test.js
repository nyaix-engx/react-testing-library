import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";

createServer([
  {
    path: "/api/repositories",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];

      return {
        items: [
          {
            id: `${language}_1`,
            full_name: `${language}_one`,
          },
          {
            id: `${language}_2`,
            full_name: `${language}_two`,
          },
        ],
      };
    },
  },
]);

test("render two links for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];
  for (let language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });
    // expect(link).toHaveAttribute('href',`${language}_`);
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
  await pause();
});

const pause = () => new Promise((resolve) => setTimeout(() => resolve(), 100));
