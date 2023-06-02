import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";  // css import
import { IReserveBooking, IReserveError, IReserveSuccess, checkBooking, getRoom, getRoomReviews, reserveBooking } from "../api";
import { IReview, IRoomDetail } from "../types";
import { Box, Grid, Heading, Skeleton, Image, GridItem, VStack, HStack, Text, Avatar, Container, Button, useToast, Divider, InputGroup, InputLeftAddon, Input, FormControl, FormLabel, Toast } from "@chakra-ui/react";
import { FaPencilAlt, FaStar, FaUserFriends } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";

export default function RoomDetail() {
    const { roomPk } = useParams();
    const { isLoading, data } = useQuery<IRoomDetail>([`rooms`, roomPk], 
    getRoom);
    const { data:reviewsData, isLoading: isReviewsLoading } = useQuery<IReview[]>([`rooms`, roomPk, `reviews`], getRoomReviews)
    const [dates, setDates] = useState<Date[] | undefined>();
    const {
        data:checkBookingData, 
        isLoading:isCheckingBooking,
        refetch,
    } = useQuery(["check", roomPk, dates], checkBooking, 
        {
            cacheTime:0,
            enabled: dates !== undefined,
        }
    );
    const handleDateChange = (value: any) => {
        setDates(value);
    }
    const toast = useToast();
    const mutation = useMutation<IReserveSuccess, IReserveError, IReserveBooking>
    (
        reserveBooking,
        {
            onSuccess: (data) => {
            refetch();
            toast({
                position: "top",
                status: "success",
                title: "Reserved room",
                description: `room: ${data.room}, check in: ${data.check_in} check out: ${data.check_out}`,
            });
        },
            onError: (error) => console.log(error),
        }
    );
    interface IGuest {
        guests: number;
    }
    const { register, watch, handleSubmit } = useForm<IGuest>();

    const onReservationSubmit = (data: IGuest) =>{
        if (dates && roomPk) {
            const guests = data.guests;
            console.log(guests);
            mutation.mutate({ dates, roomPk, guests});
        }
    };
    return (
        <Box
            mt={10}
            px={{
                base:10,
                lg: 40,
            }}
        >
            <Helmet>
                <title>{data?data.name : "Loading..."}</title>
            </Helmet>
            <HStack justifyContent={"space-between"}>
        <Skeleton h="43px" width="75%" isLoaded={!isLoading}>
            <Heading noOfLines={1}>{data?.name}</Heading>
        </Skeleton>
        {data?.is_owner ? (
            <Link to={`/rooms/${roomPk}/edit`}>
                <Button colorScheme={"gray"}>
                    <FaPencilAlt fontSize={"15"} />
            </Button>
            </Link>
        ) : null}
        </HStack>
            <Grid 
                mt={5}
                rounded="xl"
                overflow={"hidden"}
                gap={2}
                height="60vh"
                templateRows={"1fr 1fr"}
                templateColumns={"repeat(4, 1fr)"}
            >
                {[0, 1, 2, 3, 4].map((index) => (
                <GridItem 
                    colSpan={index === 0 ? 2 : 1}
                    rowSpan={index === 0 ? 2 : 1}
                    overflow={"hidden"} key={index}
                >
                    <Skeleton isLoaded={!isLoading} h="100%" w="100%">
                        {data?.photos && data.photos.length > 0 ?(
                            <Image 
                            objectFit={"cover"} 
                            w="100%" 
                            h="100%" 
                            src={data?.photos[index].file} />
                        ): null}
                    </Skeleton>
                </GridItem>
                ))}
            </Grid>
            <Grid gap={20} templateColumns={"2fr 1fr"} maxW="container.lg">
                <Box>
                    <HStack justifyContent={"space-between"} mt={10}>
                        <VStack alignItems={"flex-start"}>
                            <Skeleton isLoaded={!isLoading} height={"30px"}>
                                <Heading fontSize={"2xl"}>House hosted by {data?.owner.name}</Heading>
                            </Skeleton>
                            <Skeleton isLoaded={!isLoading} height={"30px"}>
                                <HStack justifyContent={"flex-start"} w="100%">
                                    <Text>
                                        {data?.toilets} toilet{data?.toilets === 1 ? "":"s"}
                                    </Text>
                                    <Text>·</Text>
                                    <Text>
                                    {data?.rooms} room{data?.rooms === 1 ? "":"s"}
                                    </Text>
                                </HStack>
                            </Skeleton>
                        </VStack>
                        <Avatar name={data?.owner.name} overflow={"hidden"} size={"xl"} src={data?.owner.avatar}/>
                        </HStack>
                        <Divider mt={10} mb={10} />
                        <Skeleton isLoaded={!isLoading} w="50%">
                            <HStack mb="10">
                                <FaStar /> <Heading>{data?.rating}</Heading>
                                    <Heading>·</Heading>
                                    <Heading>{reviewsData?.length} review{reviewsData?.length === 1 ? "":"s"}</Heading>
                            </HStack>
                        </Skeleton>
                                <Grid rowGap={10} columnGap={20} templateColumns={"1fr 1fr"}>
                                    {reviewsData?.map((review, index) => 
                                        <VStack alignItems={"flex-start"} key={index}>
                                            <HStack>
                                                <Avatar 
                                                name={review.user.name} 
                                                src={review.user.avatar} 
                                                size="md"
                                                />
                                                    <VStack spacing={0} alignItems={"flex-start"}>
                                                        <Heading fontSize={"md"}>{review.user.name}</Heading>
                                                        <HStack spacing={1}>
                                                            <FaStar size="12px"/>
                                                            <Text>{review.rating}</Text>
                                                        </HStack>
                                                    </VStack>
                                                </HStack>
                                                <Text>{review.payload}</Text>
                                            </VStack>
                                            )}
                                        </Grid>
                                </Box>
                                <Box pt={10}>
                                    <Calendar
                                        onChange={handleDateChange} 
                                        prev2Label={null} 
                                        next2Label={null} 
                                        minDetail="month" 
                                        minDate={new Date()} 
                                        maxDate={new Date(Date.now() + 60*60*24*7*4*6*1000)} 
                                        selectRange
                                    />
                                    <VStack as="form" onSubmit={handleSubmit(onReservationSubmit)}>
                                        <FormControl>
                                            <FormLabel mt={4}>Guests</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon children={<FaUserFriends />} />
                                                <Input 
                                                    {...register("guests", { required: true})}
                                                    required
                                                    type="number"
                                                    min={0}
                                                />
                                                </InputGroup>
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            my={5}
                                            w="100%"
                                            colorScheme={"red"}
                                            isLoading={isCheckingBooking}
                                            isDisabled={!checkBookingData?.ok && Boolean(dates)}
                                            >
                                            Make booking
                                        </Button>
                                    </VStack>
                                    <Link to={`/rooms/${roomPk}/reservations`}>
                                        <Button colorScheme={"pink"} mt="5" w="100%">
                                            {data?.is_owner ? "방 예약 현황" : "나의 예약 현황"}
                                        </Button>
                                    </Link>
                                    {!isCheckingBooking && !checkBookingData?.ok ? (
                                    <Text color="red.500">
                                        Cant' book on those dates, sorry.</Text>
                                    ) : null}
                                </Box>
                            </Grid>
                        </Box>
                            
    );
}