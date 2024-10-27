import { motion } from "framer-motion";
import { Dispatch } from "react";

const modalVarient = {
  initial: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const Modal = ({
  state,
  type,
}: {
  type: "development" | "guest";
  state: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const delayAction = () => {
    state((prev) => !prev);
  };
  return (
    <section className="fixed inset-0 z-[2] h-dvh w-dvw backdrop-blur-[2px]">
      <motion.div
        variants={modalVarient}
        initial="initial"
        animate="open"
        exit="exit"
        className="space-y-2 max-w-[600px] w-[85%] mx-auto mt-20 bg-white text-black p-6 shadow-2xl rounded"
      >
        <img
          src="/spotify-web/icons/spotify-logo.svg"
          alt=""
          className="size-12 object-cover object-center"
        />
        {type === "development" ? (
          <>
            <p className="leading-relaxed">
              This app is still under development and is currently running in
              Spotify's
              <a
                href="https://developer.spotify.com/documentation/web-api/concepts/apps"
                rel="noreferrer"
                target="_blank"
                className="text-spotify_green font-semibold"
              >
                {" "}
                Development Mode
              </a>
              . This means that up to 25 users can log in and test the app right
              now. If you want to explore the app's full features using your
              Spotify account, I’ll need to add you to an allowlist.
            </p>

            <p className="pt-4 leading-relaxed">
              Feel free to reach out via{" "}
              <a
                href="https://www.linkedin.com/in/isak-tilahun-27b242280/"
                rel="noreferrer"
                target="_blank"
                className="text-blue-500 font-semibold"
              >
                LinkedIn
              </a>{" "}
              if you have any questions or if you're interested in becoming a
              test user!
            </p>
          </>
        ) : (
          <>
            <p className="leading-relaxed">
              You're currently using the guest version of this application,
              which provides limited access to features. To enjoy the full
              experience, please log in with your account.
            </p>
          </>
        )}
        <button
          onClick={delayAction}
          className="px-4 py-2 rounded-3xl text-white text-sm bg-spotify_black"
        >
          Continue
        </button>
      </motion.div>
    </section>
  );
};

export default Modal;
