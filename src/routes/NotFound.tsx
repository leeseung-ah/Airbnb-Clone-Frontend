import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export default function Notfound(){
    return (
    <VStack bg="gray.100" justifyContent={"center"} minH="100vh">
        <Heading>Page not found.</Heading>
        <Text>It seems thant you're lost.</Text>
        <Link to="/">
            <Button colorScheme={"twitter"} variant={"link"}>Go home &rarr;</Button>
        </Link>
    </VStack>
    );
}
