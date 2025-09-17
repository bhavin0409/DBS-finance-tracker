"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Hero = () => {
    return (
        <div className="mb-20 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl md:text-8xl lg:text-[105xl] pb-2 gradient-title">Manage Your Finances <br />
                    With Intelligence</h1>

                <p className="text-xl text-gray-600 mb-8 mx-auto max-w-2xl">An AI-powered finance management platform that helps you track, analyze, and optimize your spending with real-time insights</p>

                <div className="flex justify-center space-x-4 ">
                    <Link href={"/dashboard"}>
                        <Button size={"lg"} className={"px-8"}> Get Started </Button>
                    </Link>

                    <Link href={"/dashboard"}>
                        <Button size={"lg"} variant={"outline"} className={"px-8"}> Demo Video </Button>
                    </Link>
                </div>

                {/* <div className="mt-16">
                    <Image src={'/banner.jpeg'} alt="Banner Image" width={1280} height={720} priority className="rounded-lg shadow-2xl border mx-auto"/>
                </div> */}
            </div>
        </div>
    )
}

export default Hero