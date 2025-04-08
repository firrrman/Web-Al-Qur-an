// Buat file baru, misalnya InstallButton.tsx
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallButton = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Periksa apakah PWA sudah terinstal
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Tangkap event beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Simpan event agar dapat dipicu nanti
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Deteksi ketika PWA diinstal
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Tampilkan prompt instalasi
    installPrompt.prompt();

    // Tunggu pengguna merespons prompt
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("Pengguna menerima instalasi PWA");
    } else {
      console.log("Pengguna menolak instalasi PWA");
    }

    // Bersihkan prompt karena tidak dapat digunakan lagi
    setInstallPrompt(null);
  };

  // Hanya tampilkan tombol jika PWA dapat diinstal dan belum terinstal
  if (!installPrompt || isInstalled) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="install-button bg-green-800 hover:bg-green-600 transition-all absolute top-4 right-8 lg:right-16 cursor-pointer text-white font-semibold p-2 rounded flex items-center"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Instal Aplikasi
    </button>
  );
};

export default InstallButton;
