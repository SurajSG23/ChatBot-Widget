"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";

const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.2,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              style={{
                color: "black",
                opacity: 0,
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      style={{ fontWeight: "semi-bold", ...(className ? { className } : {}) }}
    >
      <div>
        <div
          style={{
            color: "black",
            fontSize: "1rem",
            lineHeight: "1.375",
            letterSpacing: "0.05em",
          }}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export default TextGenerateEffect;
