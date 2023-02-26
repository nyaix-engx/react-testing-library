import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RepositoriesListItem from "./RepositoriesListItem";

// jest.mock("../tree/FileIcon", () => {
//   return () => {
//     return "FileIcon";
//   };
// });

function renderComponent() {
  const repository = {
    full_name: "React",
    language: "Javascript",
    description: "Frontend Library",
    owner: {
      login: "Facebook",
    },
    name: "Javascript",
    html_url: "https://github.com/vercel/next.js",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test("testing for repository link", async () => {
  const { repository } = renderComponent();
  await screen.findByRole("img", {
    name: "Javascript",
  });

  const link = screen.getByRole("link", {
    name: /github repository/i,
  });
  expect(link).toHaveAttribute("href", repository.html_url);
});

// const pause = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 100);
//   });
// };

test("shows a file with appropriate file icon", async () => {
  renderComponent();
  const icon = await screen.findByRole("img", {
    name: "Javascript",
  });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();
  await screen.findByRole("img", {
    name: "Javascript",
  });
  const codeEditorLink = screen.getByRole("link", {
    name: new RegExp(repository.owner.login),
  });
  expect(codeEditorLink).toHaveAttribute(
    "href",
    `/repositories/${repository.full_name}`
  );
});
