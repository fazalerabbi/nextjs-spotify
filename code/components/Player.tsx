"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongFile from "@/hooks/useLoadSongFile";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
    const player = usePlayer();
    const { song } = useGetSongById(player.activeId);
    const songURL = useLoadSongFile(song!);

    if (!player.activeId || !song || !songURL) {
        return null;
    }

    console.log(songURL);

    return (
        <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
            <PlayerContent
                key={songURL}
                song={song}
                songURL={songURL}
            />
        </div>
    );
}

export default Player;