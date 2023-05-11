import { Avatar, Box, Button, HStack, IconButton, LightMode, Menu, MenuButton, MenuItem, MenuList, Stack, useColorMode, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaAirbnb, FaMoon, FaSun } from "react-icons/fa";
import  LoginModal  from "./LoginModal";
import SignUpModal from "./SignUpModal"; 
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Header() {
    const {userLoading, isLoggedIn, user} = useUser();
    const{ isOpen:isLoginOpen , onClose:onLoginClose, onOpen:onLoginOpen, } = useDisclosure();
    const { isOpen:isSignUpOpen, onClose:onSignUpClose, onOpen: onSignUpOpen,} = useDisclosure();
    const { toggleColorMode } = useColorMode();
    const logoColor = useColorModeValue("red.500", "red.200");
    const Icon = useColorModeValue(FaMoon, FaSun);
    const toast = useToast();
    const QueryClient = useQueryClient();
    const onLogOut = async() => {
        const toastId = toast({
            title: "Login out...",
            description:"Sad to see you go...",
            status: "loading",
            position: "bottom-right",
        });
        await logOut();
        QueryClient.refetchQueries(["me"]);
        toast.update(toastId, {
            status: "success",
            title: "Done!",
            description: "See you later!",
            });
        };
    return (
        <Stack 
            justifyContent={"space-between"} 
            alignItems="center"
            py={5} 
            px={40} 
            direction={{
                sm: "column",
                md: "row",
            }} 
            spacing={{
                sm: 4,
                md: 0,
            }}
            borderBottomWidth={1}
        >
            <Box color={logoColor}>
                <Link to={"/"}>
                    <FaAirbnb size={"48"}/>
                </Link>
            </Box>
            <HStack spacing={2}>
                <IconButton onClick={toggleColorMode} variant={"ghost"} arial-label="Toggle dark mode" icon={<Icon />} aria-label={""}/>
                {!userLoading ? !isLoggedIn ? (
                <>
                <Button onClick={onLoginOpen}>Log in</Button>
                <LightMode>
                    <Button onClick={onSignUpOpen} colorScheme={"red"}>Sign up</Button>
                </LightMode>
                </>
                ) : ( 
                <Menu>
                    <MenuButton>
                        <Avatar name={user?.name} src={user?.avatar} size={"md"} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={onLogOut}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            ) : null} 
            </HStack>
        <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
        <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose}/>
        </Stack>
    );
}