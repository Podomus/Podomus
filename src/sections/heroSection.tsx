"use client";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { IoCalendarOutline, IoPlay, IoAdd } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import AppointmentModal from "../components/AppointmentModal";
import { useRouter } from "next/navigation"; // Ajout du router

const services: { title: string; text: string }[] = [
	{
		title: "Soins personnalisés",
		text: "Un diagnostic clinique complet précède chaque soin — aucun protocole ne s'applique avant que vos pieds aient été vus.",
	},
	{
		title: "Techniques de pointe",
		text: "Orthoplastie, orthonyxie, laser — des techniques maîtrisées en milieu de luxe, appliquées ici avec la même exigence.",
	},
	{
		title: "Suivi & Conseils",
		text: "Parce que vos pieds évoluent entre deux rendez-vous, la Dre Affes Ben Mahmoud assure un suivi continu — conseils adaptés, ajustements, prévention.",
	},
];

// Typing effect
function TypingTitle({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	const [displayed, setDisplayed] = useState("");
	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			setDisplayed(text.slice(0, i + 1));
			i++;
			if (i >= text.length) {
				clearInterval(interval);
			}
		}, 100);
		return () => clearInterval(interval);
	}, [text]);

	return (
		<span className={className}>
			{displayed}
			<span className="animate-pulse">|</span>
		</span>
	);
}

// Composant pour les formes organiques floues
function OrganicShapes() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{/* Forme principale - couleur brand Podomus */}
			<motion.div
				className="absolute top-20 right-10 w-96 h-96 bg-softtail-500/40 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2, ease: "easeOut" }}
			/>

			{/* Forme secondaire - couleur highlight Podomus */}
			<motion.div
				className="absolute bottom-20 left-10 w-80 h-80 bg-softtail-400/35 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
			/>

			{/* Forme tertiaire - couleur neutralbg Podomus */}
			<motion.div
				className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#E8E4D9]/50 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2, delay: 1, ease: "easeOut" }}
			/>

			{/* Formes de fusion avec la section suivante - partie haute */}
			<motion.div
				className="absolute top-32 left-16 w-64 h-64 bg-softtail-500/25 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
			/>

			{/* Forme de transition vers la section suivante */}
			<motion.div
				className="absolute bottom-32 right-20 w-56 h-56 bg-softtail-400/30 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.2, delay: 0.7, ease: "easeOut" }}
			/>

			{/* Forme centrale - fusion des couleurs */}
			<motion.div
				className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-softtail-500/25 to-softtail-400/25 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.8, delay: 1.2, ease: "easeOut" }}
			/>

			{/* Forme de transition haute */}
			<motion.div
				className="absolute top-16 left-1/2 w-40 h-40 bg-neutralbg/40 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.3, delay: 0.9, ease: "easeOut" }}
			/>

			{/* Forme de fusion basse - prépare la transition */}
			<motion.div
				className="absolute bottom-16 left-1/2 w-52 h-52 bg-gradient-to-tr from-softtail-400/20 to-softtail-500/20 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.6, delay: 1.5, ease: "easeOut" }}
			/>

			{/* Formes géométriques de transition */}
			<motion.div
				className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-softtail-500/35 to-softtail-400/35 rounded-lg blur-2xl rotate-12"
				initial={{ scale: 0.85, opacity: 0, rotate: 0 }}
				animate={{ scale: 1, opacity: 1, rotate: 12 }}
				transition={{ duration: 3, delay: 0.4, ease: "easeOut" }}
			/>

			<motion.div
				className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-gradient-to-tr from-neutralbg/45 to-softtail-500/30 rounded-lg blur-2xl -rotate-12"
				initial={{ scale: 0.85, opacity: 0, rotate: 0 }}
				animate={{ scale: 1, opacity: 1, rotate: -12 }}
				transition={{ duration: 2.7, delay: 1.1, ease: "easeOut" }}
			/>

			{/* Formes de fusion supplémentaires */}
			<motion.div
				className="absolute top-40 right-1/3 w-36 h-36 bg-softtail-500/20 rounded-full blur-2xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.4, delay: 0.6, ease: "easeOut" }}
			/>

			<motion.div
				className="absolute bottom-40 left-1/3 w-44 h-44 bg-softtail-400/25 rounded-full blur-2xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.9, delay: 1.3, ease: "easeOut" }}
			/>

			{/* Forme centrale de fusion */}
			<motion.div
				className="absolute top-1/2 right-1/2 w-60 h-60 bg-gradient-to-br from-neutralbg/35 to-softtail-400/20 rounded-full blur-3xl"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 3.2, delay: 0.8, ease: "easeOut" }}
			/>

			{/* Formes de transition vers la section suivante - partie basse */}
			<motion.div
				className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-softtail-400/20 to-transparent"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 2, delay: 1.8, ease: "easeOut" }}
			/>

			<motion.div
				className="absolute bottom-0 right-0 w-64 h-48 bg-gradient-to-tl from-softtail-500/15 to-transparent rounded-tl-full"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.5, delay: 2, ease: "easeOut" }}
			/>

			<motion.div
				className="absolute bottom-0 left-1/3 w-48 h-40 bg-gradient-to-tr from-[#E8E4D9]/25 to-transparent rounded-tr-full"
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2.3, delay: 2.2, ease: "easeOut" }}
			/>


		</div>
	);
}

export default function HeroSection() {
	const heroTextRef = useRef<HTMLDivElement>(null);
	const heroImageRef = useRef<HTMLDivElement>(null);
	const heroBadgeRef = useRef<HTMLDivElement>(null);
	const [openModal, setOpenModal] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Image moves up slower than scroll (parallax depth)
			gsap.to(heroImageRef.current, {
				yPercent: -15,
				ease: "none",
				scrollTrigger: {
					trigger: heroImageRef.current,
					start: "top top",
					end: "bottom top",
					scrub: 0.8,
				},
			});

			// Text moves up slightly faster (creates depth separation)
			gsap.to(heroTextRef.current, {
				yPercent: -8,
				ease: "none",
				scrollTrigger: {
					trigger: heroTextRef.current,
					start: "top top",
					end: "bottom top",
					scrub: 0.5,
				},
			});

			// Subtle image scale as user scrolls
			gsap.to(heroImageRef.current?.querySelector("img") || heroImageRef.current, {
				scale: 1.06,
				ease: "none",
				scrollTrigger: {
					trigger: heroImageRef.current,
					start: "top top",
					end: "bottom top",
					scrub: 1,
				},
			});
		});

		return () => ctx.revert();
	}, []);

	return (
		<section
			className="relative container min-h-screen overflow-hidden"
			style={{
				background: "#F8FAFC",
			}}
		>
			{/* Formes organiques */}
			<OrganicShapes />

			{/* Effet de fusion avec la section suivante */}
			<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F5] via-[#E8E4D9]/50 to-transparent"></div>

			<div className="mx-auto flex w-full flex-col items-center justify-center py-0 lg:py-0 px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[50vh] w-full">
					{/* Contenu de gauche - style exact de l'image */}
					<div ref={heroTextRef}>
					<motion.div
						className="lg:pr-8 p-8 sm:p-12 lg:p-16"
						variants={fadeIn("right", 0)}
						initial="hidden"
						animate="show"
					>
						{/* Badge "Podologie" */}
						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.35, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
							className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 mb-8"
						>
							<div className="w-2 h-2 bg-softtail-500 rounded-full"></div>
							<span className="text-lg sm:text-xl font-light text-softtail-400 tracking-wide uppercase">
								Podologie
							</span>
						</motion.div>

						{/* Titre principal - style exact de l'image */}
						<motion.h1
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
							className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
						>
							<span className="text-softtail-500 block">Podomus</span>
							<span className="text-gray-800 block">Podologie de précision.</span>
						</motion.h1>

						{/* Description - style exact de l'image */}
						<motion.p
							initial={{ y: 16, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.26, ease: [0.23, 1, 0.32, 1] }}
							className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg"
						>
							Formée dans les studios Bastien Gonzalez — aux Maldives, à Dubaï — la Dre Sonda Affes Ben Mahmoud exerce depuis plus de 10 ans la podologie de précision qu'on ne trouve d'ordinaire que dans les grands hôtels. Ici, c'est votre cabinet.
						</motion.p>

						{/* Boutons principaux - style uniforme */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
							{/* Bouton principal - Prendre rendez-vous */}
							<Button
								className="w-full sm:w-auto min-w-0 bg-softtail-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:bg-softtail-400/90 hover:shadow-xl transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.97] flex items-center justify-center gap-3 group text-base sm:text-lg"
								onPress={() => setOpenModal(true)}
							>
								<IoCalendarOutline
									size={20}
									className="group-hover:rotate-12 transition-transform duration-150"
								/>
								<span>Prendre rendez-vous</span>
							</Button>

							{/* Bouton secondaire - Découvrir nos services */}
							<Button
								className="w-full sm:w-auto min-w-0 bg-white text-softtail-500 border-2 border-softtail-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:bg-softtail-500 hover:text-white hover:shadow-xl transition-[transform,background-color,border-color,color,box-shadow] duration-150 active:scale-[0.97] flex items-center justify-center gap-3 group text-base sm:text-lg"
								onPress={() => router.push("/service")}
							>
								<IoPlay
									size={20}
									className="group-hover:scale-110 transition-transform duration-150"
								/>
								<span>Voir nos soins</span>
							</Button>
						</div>

						{/* Statistiques - style exact de l'image */}
						<div className="flex justify-between items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
							<div className="text-center">
								<div className="text-2xl sm:text-3xl font-bold text-softtail-400">
									500+
								</div>
								<div className="text-sm text-gray-600">
									Consultations
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl sm:text-3xl font-bold text-softtail-400">
									10+
								</div>
								<div className="text-sm text-gray-600">
									Années d&apos;exercice
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl sm:text-3xl font-bold text-softtail-400">
									2
								</div>
								<div className="text-sm text-gray-600">Studios Bastien Gonzalez</div>
							</div>
						</div>
					</motion.div>
					</div>

					{/* Image de droite - forme exacte de l'image de référence */}
					<div ref={heroImageRef}>
					<motion.div
						className="relative flex items-center justify-center w-full"
						initial={{ x: 40, opacity: 0 }}
						whileInView={{ x: 0, opacity: 1 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.06 }}
					>
						{/* Conteneur principal avec cadre arrondi */}
						<div className="relative w-full max-w-lg">
							{/* Cadre central avec partie supérieure ronde et inférieure droite */}
							<div className="relative bg-white rounded-t-full rounded-b-3xl shadow-2xl overflow-hidden">
								{/* Image principale */}
								<div className="relative">
									<Image
										src="/5.jpg"
										alt="Podologue professionnel"
										sizes="100vw"
										width={0}
										height={0}
										className="w-full h-auto object-cover"
									/>

									{/* Effet de profondeur de champ - flou d'arrière-plan */}
									<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
								</div>
							</div>

							{/* Formes organiques en arrière-plan (style exact de l'image) */}
							<div className="absolute inset-0 -z-10">
								{/* Forme beige en haut à droite */}
								<motion.div
									className="absolute -top-8 -right-8 w-32 h-32 bg-[#F5F5DC]/30 rounded-full blur-xl"
									initial={{ scale: 0.85, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 1.5, delay: 0.8 }}
								/>

								{/* Forme sombre en bas à gauche */}
								<motion.div
									className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-800/20 rounded-full blur-xl"
									initial={{ scale: 0.85, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 1.5, delay: 1.0 }}
								/>
							</div>
						</div>
					</motion.div>
					</div>
				</div>
			</div>

			{/* Section Services intégrée */}
			<div
				className="relative z-10 mx-auto flex w-full flex-col items-center justify-center py-0 sm:py-0 lg:py-0 px-4 sm:px-6 lg:px-8"
				style={{ backgroundColor: "#F8FAFC" }}
			>
				<div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 md:items-start md:justify-start text-textmain">
					<div className="text-center md:text-start px-2 sm:px-0 p-8 sm:p-12 lg:p-16">
						<span className="text-lg sm:text-xl font-light text-softtail-400 tracking-wide uppercase">
							Nos Services
						</span>
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold xl:text-5xl text-brand mt-2">
							Ce que les meilleurs hôtels font pour vos pieds — maintenant en cabinet privé.
						</h2>
						<p className="mt-2 text-sm sm:text-base md:text-lg text-textmain font-medium">
							La Dre Affes Ben Mahmoud a exercé dans les studios Bastien Gonzalez — des références mondiales du soin podologique, aux Maldives et à Dubaï. Chaque consultation chez Podomus applique les mêmes standards.
						</p>
					</div>

					<motion.div
						className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 w-full px-2 sm:px-0"
						variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-80px" }}
					>
						{[
							{ anchor: "soins" },
							{ anchor: "orthoplastie" },
							{ anchor: "conseils" },
						].map((meta, index) => (
							<motion.div
								key={`service-${index}`}
								variants={{
									hidden: { opacity: 0, y: 16 },
									visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } },
								}}
								className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-softtail-400/10 hover:border-softtail-400/30 transition-[border-color,box-shadow] duration-200 group hover:shadow-2xl"
							>
								<div className="w-16 h-16 bg-softtail-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-softtail-400/20 transition-colors duration-200">
									<TbTargetArrow size={32} className="text-softtail-400" />
								</div>
								<h4 className="mb-2 font-bold text-softtail-400 group-hover:underline text-base sm:text-lg">
									{services[index].title}
								</h4>
								<p className="text-xs sm:text-sm font-light">
									{services[index].text}
								</p>
							</motion.div>
						))}
					</motion.div>

					<motion.div
						initial={{ y: 16, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.3, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
						className="w-full flex justify-center"
					>
						<Button
							className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 lg:px-10 text-sm sm:text-base md:text-lg font-semibold bg-softtail-500 text-white hover:bg-softtail-600 hover:shadow-lg transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.97] tracking-wide uppercase"
							endContent={
								<IoCalendarOutline size={20} className="ml-2" />
							}
							onPress={() => setOpenModal(true)}
						>
							<span className="hidden sm:inline">
							Prendre rendez-vous
							</span>
							<span className="sm:hidden">Prendre RDV</span>
						</Button>
					</motion.div>
				</div>
			</div>

			{/* Modal de rendez-vous */}
			<AppointmentModal
				open={openModal}
				onClose={() => setOpenModal(false)}
			/>
		</section>
	);
}
