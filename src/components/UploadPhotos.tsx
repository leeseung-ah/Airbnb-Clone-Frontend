import {
    Box,
    Button,
    Container,
    FormControl,
    Heading,
    Input,
    Toast,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { useMutation } from "@tanstack/react-query";
import { createPhoto, getUploadURL, uploadImage } from "../api";
import HostOnlyPage from "../components/HostOnlyPage";

interface IForm {
    file:FileList;
}

interface IUploadResponse {
    id: string;
    uploadURL: string;
}

export default function UploadPhotos() {
    const { register, handleSubmit, watch, reset } = useForm<IForm>();
    const { roomPk } = useParams();
    const toast = useToast();
    const createPhotoMutation = useMutation(createPhoto, {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Image uploaded!",
                isClosable: true,
                description: "Feel free to upload more images.",
            });
            reset()
        },
    });
    const uploadImageMutation = useMutation(uploadImage, {
        onSuccess: ({result}: any) => {
            if(roomPk){
                createPhotoMutation.mutate({
                    description: "I love react",
                    file: `https://imagedelivery.net/WXWSA714-gLH27T2-bPfCw/${result.id}/public`,
                    roomPk
                });
            }
        },
    });
    const uploadURLMutation = useMutation(getUploadURL, {
        onSuccess:(data:IUploadResponse) => {
            uploadImageMutation.mutate({
                uploadURL:data.uploadURL,
                file: watch("file"),
            })
        },
    });
    return (
        <ProtectedPage>
            <HostOnlyPage>
                <Box
                    pb={40}
                    mt={10}
                    px={{
                    base: 10,
                    lg: 40,
                    }}
                >
                    <Container>
                        <Heading textAlign={"center"}>Upload a Photo</Heading>
                        <VStack as="form" spacing={5} mt={10}>
                            <FormControl>
                                <Input {...register("file")} type="file" accept="image/*" />
                            </FormControl>
                            <Button isLoading={createPhotoMutation.isLoading || uploadImageMutation.isLoading || uploadURLMutation.isLoading} type="submit" w="full" colorScheme={"red"}>
                                Upload photos
                            </Button>
                        </VStack>
                    </Container>
                </Box>
            </HostOnlyPage>
        </ProtectedPage>
        );
    }