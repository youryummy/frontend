import { Button } from "@mui/material";
import { increment } from "../store/counterSlice";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter.count);

  return (
    <>
      <h1>
        Counter: <span>{counter}</span>
      </h1>
      <Button variant="contained" onClick={() => dispatch(increment())}>
        Click to increment
      </Button>
      <Link href="/about">Navigate to about</Link>
    </>
  );
}
