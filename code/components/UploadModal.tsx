"use client";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import uniqid from "uniqid";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";

import Input from "./Input";
import Modal from "./Modal";
import Button from "./Button";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const UploadModal = useUploadModal();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            UploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error("Missing fields");
                return;
            }

            const uniqueID = uniqid();

            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songError) {
                setIsLoading(false);
                return toast.error('Failed song upload');
            }

            const {
                data: songImageData,
                error: songImageError
            } = await supabaseClient
                .storage
                .from('songs_images')
                .upload(`songs_images-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songImageError) {
                setIsLoading(false);
                return toast.error('Failed song image upload');
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: songImageData.path,
                    song_path: songData.path
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Song created!');
            reset();
            UploadModal.onClose();
        } catch (error) {

        } finally {
            setIsLoading(true);
        }

    }

    return (
        <Modal
            title="Add a song"
            description="Upload a mp3 file"
            isOpen={UploadModal.isOpen}
            onChange={onChange}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song Title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song Author"
                />

                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        id="song"
                        type="file"
                        disabled={isLoading}
                        {...register('song', { required: true })}
                        accept=".mp3"
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select a song banner
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        {...register('image', { required: true })}
                        accept="image/*"
                    />
                </div>

                <Button
                    disabled={isLoading}
                    type="submit"
                >
                    Create
                </Button>

            </form>
        </Modal>
    );
}

export default UploadModal;
