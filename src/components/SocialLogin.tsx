import { Box, Divider, HStack, VStack, Button, Text } from "@chakra-ui/react";
import { FaComment, FaGithub } from "react-icons/fa";


export default function SocialLogin() {
    const kakaoParams = {
        client_id : "84fe9eb6154c23807d7e6a15fa7a7be8",
        redirect_uri: "http://127.0.0.1:3000/social/kakao",
        response_type: "code",
    };
    const params = new URLSearchParams(kakaoParams).toString();

    return (
        <Box mb={4}>
            <HStack my={8}>
                <Divider />
                <Text textTransform={"uppercase"} color="gray.500" fontSize="xs" as="b">Or</Text>
                <Divider />
                </HStack>
            <VStack>
                <Button as="a" href="https://github.com/login/oauth/authorize?client_id=0fa15829f2156d8fe3f3&scope=read:user,user:email" w="100%" leftIcon={<FaGithub />}>Continue with Github</Button>
                <Button as="a" href={`https://kauth.kakao.com/oauth/authorize?${params}`} w="100%" leftIcon={<FaComment />} colorScheme={"yellow"}>Continue with Kakao</Button>
            </VStack>
        </Box>
    );
}



