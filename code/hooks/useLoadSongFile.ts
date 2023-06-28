import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongFile = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song) {
    return "";
  }

  const { data: songFile } = supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.song_path);

  return songFile.publicUrl;
};

export default useLoadSongFile;
