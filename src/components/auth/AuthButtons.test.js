import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AuthButtons from "./AuthButtons";
import { SWRConfig } from "swr";
import { createServer } from "../../test/server";

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole("link");
}

describe("When user is signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        console.log("LOGGED IN RESPONSE");
        return {
          user: {
            id: 1,
            email: "sanjaysajwan765@gmail.com",
          },
        };
      },
    },
  ]);

  test("signin and signup is not visible", async () => {
    debugger;
    await renderComponent();

    const signupButton = screen.queryByRole("link", {
      name: /sign up/i,
    });

    const signinButton = screen.queryByRole("link", {
      name: /sign in/i,
    });

    expect(signinButton).not.toBeInTheDocument();
    expect(signupButton).not.toBeInTheDocument();
  });

  test("signout is visible", async () => {
    await renderComponent();

    const signoutButton = screen.getByRole("link", {
      name: /sign out/i,
    });

    expect(signoutButton).toBeInTheDocument();
    expect(signoutButton).toHaveAttribute("href", "/signout");
  });
});

describe("When user is not signed in", () => {
  createServer([
    {
      path: "/api/user",
      method: "get",
      res: () => {
        console.log("NOT LOGGED IN RESPONSE");
        return {
          user: null,
        };
      },
    },
  ]);

  test("signin and signup are visible", async () => {
    debugger;
    await renderComponent();
    const signinButton = screen.getByRole("link", {
      name: /sign in/i,
    });

    const signupButton = screen.getByRole("link", {
      name: /sign up/i,
    });

    expect(signinButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  test("signout is not visible", async () => {
    await renderComponent();
    const link = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(link).not.toBeInTheDocument();
  });
});

/*
Options for debugging test

1. Use 'test.only' or 'describe.only' to limit the number of tests executed.
2. Set up a debugger.
3. Classic console.log's

How to set up a debugger 

Add {"test:debug":"react-scripts --inspect-brk test --runInBand --no-cache"} after test in the script file.

Add a 'debugger' statement someone in your tests or component.

Navigate to about:inspect in your browser


*/
