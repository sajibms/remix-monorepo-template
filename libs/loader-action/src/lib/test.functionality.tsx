import { Form } from "@remix-run/react";

export function TestLoaderAction({ actionMessage, data }: any) {
  return (
    <div className="container">
      <h1>Welcome to LoaderAction!</h1>

      {/* A form to submit data */}
      <Form method="post">
        <input type="text" name="name" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <textarea name="message" placeholder="Message" />
        <button type="submit">Submit</button>
      </Form>

      <p>{data.message}</p>

      {actionMessage?.success && <p>{actionMessage?.message}</p>}
    </div>
  );
}
