import Image from "next/image";
import { assetPath } from "@/lib/site";

export default function StudioCredit() {
  return (
    <a className="studio-credit" href="https://jel.kz" target="_blank" rel="noopener noreferrer">
      <span>Designed and developed by</span>
      <Image src={assetPath("/images/jel-labs-wordmark.png")} alt="JEL Labs" width={886} height={436} />
    </a>
  );
}
