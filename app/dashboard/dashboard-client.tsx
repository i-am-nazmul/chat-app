"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Friend = {
  id: string;
  username: string;
  email: string;
};

type DashboardClientProps = {
  username: string;
  friends: Friend[];
};

export default function DashboardClient({ username, friends }: DashboardClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestedFriend, setSuggestedFriend] = useState<Friend | null>(null);
  const [friendList, setFriendList] = useState(friends);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0]?.id ?? "");

  const friendCount = useMemo(() => friendList.length, [friendList.length]);
  const selectedFriend = friendList.find((friend) => friend.id === selectedFriendId) ?? null;

  const sampleMessages = selectedFriend
    ? [
        { id: 1, from: "them", text: `Hey ${username}, are you there?`, time: "09:12" },
        { id: 2, from: "me", text: "Yes, I am here. This chat is still a dummy UI.", time: "09:13" },
        { id: 3, from: "them", text: "Perfect. Backend messaging comes next.", time: "09:14" },
      ]
    : [];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleSearchFriend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    setSuggestedFriend(null);

    const response = await fetch(
      `/api/users/search?username=${encodeURIComponent(searchValue.trim())}`,
    );
    const data = (await response.json()) as {
      message?: string;
      user?: Friend;
    };

    if (!response.ok) {
      setStatusMessage(data.message ?? "No user found.");
      return;
    }

    setSuggestedFriend(data.user ?? null);
    setStatusMessage("Suggested profile found.");
  }

  async function handleAddFriend(friendUserId: string) {
    setStatusMessage("");

    const response = await fetch("/api/friends/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendUserId }),
    });

    const data = (await response.json()) as {
      message?: string;
      friend?: Friend;
    };

    if (!response.ok) {
      setStatusMessage(data.message ?? "Unable to add friend.");
      return;
    }

    if (data.friend) {
      setFriendList((currentFriends) => {
        if (currentFriends.some((friend) => friend.id === data.friend?.id)) {
          return currentFriends;
        }

        return [...currentFriends, data.friend as Friend];
      });
    }

    setSuggestedFriend(null);
    setSearchValue("");
    setStatusMessage(data.message ?? "Friend added.");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Friends
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">
                {friendCount} total
              </h2>
            </div>
            <button
              type="button"
              aria-label="Add your friend"
              onClick={() => setIsOpen((current) => !current)}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                +
              </span>
              <span className="pointer-events-none absolute mt-24 hidden whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm group-hover:block">
                add ur friend
              </span>
            </button>
          </div>

          <div className="mt-5 flex-1 space-y-3 overflow-auto pr-1">
            {friendList.length ? (
              friendList.map((friend) => {
                const isActive = friend.id === (selectedFriend?.id ?? friendList[0]?.id);

                return (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => setSelectedFriendId(friend.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-slate-300 bg-slate-950 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-semibold">{friend.username}</p>
                    <p className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      {friend.email}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No friends added yet.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            Logout
          </button>
        </aside>

        <section className="relative flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-8 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            ChatApp Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Welcome to ChatApp, {username}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Pick a friend from the left panel and start a conversation on the right.
          </p>

          {isOpen ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearchFriend}>
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  type="text"
                  placeholder="Enter friend's username"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
                <button
                  type="submit"
                  className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:border-slate-300 hover:bg-slate-800"
                >
                  Search
                </button>
              </form>

              {statusMessage ? (
                <p className="mt-3 text-sm text-slate-600">{statusMessage}</p>
              ) : null}

              {suggestedFriend ? (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {suggestedFriend.username}
                    </p>
                    <p className="text-xs text-slate-500">{suggestedFriend.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddFriend(suggestedFriend.id)}
                    className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-300 hover:bg-slate-800"
                  >
                    Add friend
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Conversation
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">
                {selectedFriend ? selectedFriend.username : "Select a friend"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {selectedFriend ? "Dummy chat UI for now" : "Your messages will appear here"}
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              live preview
            </span>
          </div>

          <div className="mt-4 flex-1 space-y-3 overflow-auto pr-1">
            {selectedFriend ? (
              sampleMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                      message.from === "me"
                        ? "rounded-br-md bg-slate-950 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`mt-2 text-[11px] ${message.from === "me" ? "text-slate-300" : "text-slate-500"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Choose a friend from the left panel to preview the conversation
                design.
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex gap-3">
              <input
                disabled
                placeholder="Type a message..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled
                className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-medium text-white opacity-70"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Chat backend will connect here next.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}