import Image from "next/image";
import { assetPath } from "@/lib/site";

export default function StudioCredit() {
  return (
    <a className="studio-credit" href="https://jel.kz" target="_blank" rel="noopener noreferrer">
      <span>Designed and developed by</span>
      <Image src={assetPath("/images/jel-labs-logo.svg")} alt="" width={27} height={30} />
      <span>JEL Labs</span>
    </a>
  );
}
