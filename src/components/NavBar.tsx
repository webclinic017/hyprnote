import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClickOutside } from "../hooks/useClickOutside";
import { getCurrentWindow } from "@tauri-apps/api/window";
import SearchModal from "./SearchModal";
import SettingsModal from "./SettingsModal";

export default function NavBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isNotePage = location.pathname.startsWith("/note/");

  useClickOutside(searchRef, () => {
    setIsSearchOpen(false);
  });

  useClickOutside(profileRef, () => {
    setIsProfileMenuOpen(false);
  });

  const handleNewNote = () => {
    const noteId = crypto.randomUUID();
    navigate(`/note/${noteId}`);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleWindowClose = async () => {
    const appWindow = await getCurrentWindow();
    await appWindow.close();
  };

  const handleWindowMinimize = async () => {
    const appWindow = await getCurrentWindow();
    await appWindow.minimize();
  };

  const handleWindowMaximize = async () => {
    const appWindow = await getCurrentWindow();
    await appWindow.toggleMaximize();
  };

  return (
    <>
      <div className="bg-white border-b">
        <div data-tauri-drag-region className="pl-6 pr-4">
          <div
            data-tauri-drag-region
            className="h-12 flex items-center select-none"
          >
            {/* Left Section */}
            <div data-tauri-drag-region className="flex items-center gap-4">
              {/* Window Controls */}
              <div className="flex items-center gap-2 -ml-2">
                <button
                  onClick={handleWindowClose}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                />
                <button
                  onClick={handleWindowMinimize}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
                />
                <button
                  onClick={handleWindowMaximize}
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
                />
              </div>

              {/* Prefix Button - Hidden on small screens */}
              {!isNotePage && (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="hidden md:block text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg"
                >
                  무료 플랜
                </button>
              )}

              {/* Back Button for Note Page */}
              {isNotePage && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Center Section - Search Bar */}
            <div data-tauri-drag-region className="flex-1 flex justify-center">
              <div className="w-full max-w-xs relative">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 text-sm bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  검색...
                  <span className="ml-auto text-xs bg-gray-300 px-2 py-0.5 rounded">
                    ⌘K
                  </span>
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div data-tauri-drag-region className="flex items-center gap-2">
              {isNotePage ? (
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              ) : (
                <>
                  {/* New Note Button - Icon on small screens, Text on larger screens */}
                  <button
                    onClick={handleNewNote}
                    className="p-2 hover:bg-gray-100 rounded-full md:rounded-lg md:px-2.5 md:py-1.5 md:bg-blue-500 md:hover:bg-blue-600 group flex items-center gap-2"
                  >
                    <svg
                      className="size-4 text-gray-700 md:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="hidden md:block text-sm text-white">
                      새 노트
                    </span>
                  </button>
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setIsSettingsOpen(true);
                          }}
                          className="w-full text-left p-4 border-b hover:bg-gray-50"
                        >
                          <div className="font-medium">홍길동</div>
                          <div className="text-sm text-gray-500">
                            hong@example.com
                          </div>
                        </button>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setIsSettingsOpen(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            초대 링크 복사
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setIsSettingsOpen(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            설정
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setIsSettingsOpen(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            피드백 보내기
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
