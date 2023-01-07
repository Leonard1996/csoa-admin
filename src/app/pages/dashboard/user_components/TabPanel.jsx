export default function TabPanel({ step, index, children }) {
  return <>{step === index ? children : null}</>;
}
