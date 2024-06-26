"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { configurableRoles } from "../lib/data";
import { getUserInfo, updateUserInfo } from "../lib/actions";
import { UserInfo } from "../lib/models";
import Image from "next/image";
import JoinButton from "../lib/components/JoinButton";
import LoadingView from "../views/LoadingView";
import toast from "react-hot-toast";
import UiCard from "../lib/components/UiCard";

function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [website, setWebsite] = useState<string>();
  const [twitter, setTwitter] = useState<string>();
  const [threads, setThreads] = useState<string>();
  const [linkedin, setLinkedin] = useState<string>();
  const [twitch, setTwitch] = useState<string>();
  const [youtube, setYoutube] = useState<string>();
  const [tagline, setTagline] = useState<string>();
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>();
  const [memberDoesNotExist, setMemberDoesNotExist] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUserInfo(userInfo);
        setWebsite(userInfo.website);
        setTwitter(userInfo.twitter);
        setThreads(userInfo.threads);
        setLinkedin(userInfo.linkedin);
        setTwitch(userInfo.twitch);
        setYoutube(userInfo.youtube);
        setTagline(userInfo.tagline);
        setImageUrl(userInfo.imageUrl);
        setIsPublic(userInfo.isPublic ? true : false);
        userInfo.selectedRoles && setSelectedRoles(userInfo.selectedRoles);
        setDisplayName(userInfo.displayName);
      } else {
        setMemberDoesNotExist(true);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  async function save() {
    if (!userInfo) return;
    if (!displayName) {
      toast.error("Display name is required.");
      return;
    }
    toast.promise(_save(), {
      loading: "Saving...",
      success: <b>Settings saved!</b>,
      error: <b>Could not save.</b>,
    });
  }

  async function _save() {
    if (!userInfo) return;
    try {
      setIsSaving(true);
      await updateUserInfo(
        userInfo?.faunaId,
        {
          website,
          twitter,
          youtube,
          linkedin,
          threads,
          twitch,
          tagline,
          isPublic,
          imageUrl,
          displayName,
          username: userInfo.username,
        },
        selectedRoles
      );
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  function handleRoleToggled(roleId: string, isChecked: boolean): void {
    const r: string[] = selectedRoles;
    if (isChecked) {
      r.push(roleId);
    } else {
      r.splice(r.indexOf(roleId), 1);
    }
    setSelectedRoles([...r]);
  }

  return (
    <section className="space-y-8">
      {isLoading && <LoadingView />}
      {memberDoesNotExist && (
        <UiCard outerClassName="mt-10 mb-10">
          <div className="flex flex-col gap-4 items-center p-4 mb-2">
            <div>
              The user does not exist in the Discord server. Please join and
              introduce yourself before modifying your profile:
            </div>
            <div>
              <JoinButton />
            </div>
          </div>
        </UiCard>
      )}
      {!isLoading && !memberDoesNotExist && (
        <>
          <header className="flex flex-col gap-2">
            <h1>My Profile</h1>
            <p className="lg:text-lg text-balance md:max-w-prose">
              Here you can change your profile details and add/remove roles that
              will be reflected in the Discord server.
            </p>
          </header>
          <section className="flex flex-col gap-4 md:grid md:grid-cols-3">
            <UiCard
              className="space-y-4 p-2"
              outerClassName="col-span-1"
              title={userInfo?.username}
            >
              <Image
                src={userInfo?.imageUrl || "/images/default-profile.png"}
                width={75}
                height={75}
                alt={""}
                className="rounded-full"
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="displayName">
                  Display name
                  <span className="align-super text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-black rounded p-1"
                  id="displayName"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="tagline">Tagline</label>
                <textarea
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="text-black rounded p-1"
                  id="tagline"
                />
              </div>
              <div className="items-center flex gap-2">
                <label htmlFor="displayOnProfile" className="displayOnProfile">
                  Display on Profiles?
                </label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  id="displayOnProfile"
                />
              </div>
            </UiCard>
            <UiCard
              className="grid md:grid-cols-2 gap-4"
              outerClassName="md:col-span-2"
              title="Links"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="text-black rounded p-1"
                  id="website"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="x-twitter">X/Twitter</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="text-black rounded p-1"
                  id="x-twitter"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="youtube">YouTube</label>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="text-black rounded p-1"
                  id="youtube"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="twitch">Twitch</label>
                <input
                  type="text"
                  value={twitch}
                  onChange={(e) => setTwitch(e.target.value)}
                  className="text-black rounded p-1"
                  id="twitch"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="threads">Threads</label>
                <input
                  type="text"
                  value={threads}
                  onChange={(e) => setThreads(e.target.value)}
                  className="text-black rounded p-1"
                  id="threads"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="text-black rounded p-1"
                  id="linkedin"
                />
              </div>
            </UiCard>
            <UiCard title="Roles" outerClassName="md:col-span-3">
              {configurableRoles.map((role) => (
                <div key={role.id} className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRoles?.includes(role.id)}
                    onChange={(e) =>
                      handleRoleToggled(role.id, e.target.checked)
                    }
                    className="text-black rounded p-1"
                    id={role.name}
                  />
                  <label htmlFor={role.name}>{role.name}</label>
                </div>
              ))}
            </UiCard>
            <div className="grid md:w-fit">
              <button
                onClick={() => save()}
                disabled={isSaving}
                className="bg-gradient-to-b from-zinc-800 to-zinc-800 hover:from-zinc-700 hover:to-zinc-800 py-4 px-8 rounded transition-all disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default ProfilePage;
