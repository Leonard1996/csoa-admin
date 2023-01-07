import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (seconds) return;
    navigate("/", { replace: true });
  }, [seconds, navigate]);

  return (
    <p>
      <strong>
        Oops, it seems like your are lost, you will be redirected in {seconds}{" "}
        seconds
      </strong>
    </p>
  );
}
