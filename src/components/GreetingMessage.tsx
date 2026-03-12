import { useState, useEffect } from "react";

export default function GreetingMessage() {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!greeting) {
    return null;
  }

  return (
    <div className="text-center py-4">
      <p className="text-lg text-[var(--color-text-muted)]">
        {greeting} - {time}
      </p>
    </div>
  );
}
