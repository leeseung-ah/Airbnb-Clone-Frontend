import { Box, Grid, Image, VStack, Heading, Text, HStack, Button, useColorModeValue, Skeleton, SkeletonText, Link, useEditable } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RoomSkeleton from "../components/RoomSkeleton";
import Room from "../components/Room";
import { getRooms } from "../api";

interface IPhoto {
    pk: string;
    file: string;
    description: string;
}

interface IRoom {
    "pk": number,
    "name": string;
    "country": string;
    "city": string;
    "price": number;
    "rating": number;
    "is_owner": boolean;
    "photos": IPhoto[];
}

export default function Home() {
    const { isLoading, data } = useQuery<IRoom[]>(["rooms"], getRooms);
    useEffect (() => {
        console.log("hello");
    }, [])
    return (
    <Grid 
        mt={10} 
        px={{
            base: 10,
            lg: 40,
        }} 
        columnGap={4} 
        rowGap={8} 
        templateColumns={{
            sm: "1fr",
            md: "1fr 1fr",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
            "2xl": "repeat(5, 1fr)",
        }}
    >
    {isLoading ? (
        <>
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
        </>
    ) : null}
    {data?.map((room) => (
        <Room
            key={room.pk}
            pk={room.pk}
            imageUrl={room.photos[0]?.file}
            name={room.name} 
            rating={room.rating}
            city={room.city}
            country={room.country}
            price={room.price}
        />
    ))}
    </Grid>
    );
}