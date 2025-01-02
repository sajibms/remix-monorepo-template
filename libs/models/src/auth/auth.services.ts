import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { IUser } from "./auth.interface";
import { User } from "./auth.model";

export const createUser = async (payload: IUser): Promise<IUser> => {
  const user = await User.create(payload);
  return user;
};

export const signup = async (payload: IUser): Promise<true> => {
  const isExistUser = await User.findOne({ username: payload.username });
  if (!isExistUser) {
    throw new Response("user not found", { status: 404 }); // Provide status and message
  }

  if (isExistUser.username !== payload.username) {
    throw new Response("The username provided does not match.", {
      status: 404,
    });
  } else if (isExistUser.password !== payload.password) {
    throw new Response("The password provided does not match.", {
      status: 404,
    });
  }

  return true;
};

export const findUser = async (): Promise<IUser[]> => {
  const user = await User.find({});
  return user;
};

export const updateUser = async (payload: IUser) => {
  const usernameRegex =
    /^(?!.*[_.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,18}[a-zA-Z0-9])?$/;

  if (!payload.username || !usernameRegex.test(payload.username)) {
    return {
      error:
        "Invalid username. Use 3-20 characters with letters, numbers, underscores, or periods. No consecutive or trailing special characters.",
      status: 400,
    };
  }

  if (!payload.password || payload.password.trim() === "") {
    return {
      error: "Password is required",
      status: 400,
    };
  }

  try {
    const result = await User.updateOne(
      { email: "admin@gmail.com" },
      { $set: { username: payload.username, password: payload.password } },
      { new: true },
    );

    if (result.matchedCount === 0) {
      return {
        error: "No user found with the provided email.",
        status: 404,
      };
    }

    return {
      message: "User updated successfully.",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Update failed. Please try again later.",
      status: 400,
    };
  }
};

export async function verifyLogin(username: string, password: string) {
  const user = await User.findOne({ username });

  if (!user) {
    return {
      data: null,
      status: 404,
    };
  }

  // Simple password comparison instead of bcrypt
  const isValid = user.password === password;

  if (!isValid) {
    return {
      data: null,
      status: 401,
    };
  }

  // Return user without password
  return {
    data: user,
    status: 200,
  };
}

// Session storage configuration
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "private_session",
    sameSite: "lax", // Protects against CSRF
    path: "/",
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secrets: [process.env.SESSION_SECRET || "fallback_secret"],
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
  },
});

// create session func
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// get user session
export async function getUserSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
}

// Require authentication middleware
export async function requireUserSession(
  request: Request,
  redirectTo = "/login",
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId) {
    // Redirect to login if no session
    throw redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  return userId;
}

// Logout session from server
export async function logout(request: Request) {
  const session = await getUserSession(request);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
