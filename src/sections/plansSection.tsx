"use client";
import { Button, Divider } from "@nextui-org/react";
import { TbShieldCheck } from "react-icons/tb";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useInView } from "react-intersection-observer";

const plansBasic: { title: string; text: string }[] = [
  {
    title: "Consultas de Rotina Ilimitadas",
    text: "Agende consultas de rotina sem custos adicionais, garantindo que seu pet receba atenção preventiva regular.",
  },
  {
    title: "Vacinação Completa",
    text: "Todas as vacinas essenciais estão incluídas, protegendo seu pet contra doenças todas as doenças mais comuns.",
  },
  {
    title: "Descontos em Cirúrgias",
    text: "Agende consultas de rotina sem custos adicionais, garantindo que seu pet receba atenção preventiva regular.",
  },
];

const plansPro: { title: string; text: string }[] = [
  {
    title: "Exames Laboratoriais Ilimitados",
    text: "Todos os exames necessários para um diagnóstico preciso estão incluídos, sem custos adicionais.",
  },
  {
    title: "Nutrição Personalizada",
    text: "Receba orientação de especialistas para criar uma dieta personalizada para as necessidades específicas do seu pet.",
  },
  {
    title: "Atendimento Domiciliar Mensal",
    text: "Oferecemos a opção de um atendimento domiciliar, proporcionando comodidade para você e conforto para seu pet.",
  },
];

const PlansSection = () => {
  const [ref, inView] = useInView({ triggerOnce: false });
  const [refQuote, inViewQuote] = useInView({ triggerOnce: false });

  return (
    <section
      className="relative mx-auto flex  w-full flex-col items-center justify-center gap-10 bg-cover bg-center bg-no-repeat py-5 md:py-16 3xl:max-w-[1580px] 3xl:rounded-2xl"
      style={{
        background: '#F8FAFC'
      }}
      id="Plans"
      ref={ref}
    >
      {/* Formes organiques avec soft teal */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-36 h-36 bg-[#E8E4D9]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-softtail-400/12 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#E8E4D9]/25 rounded-full blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />

      <motion.div
        variants={fadeIn("up", 0)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        exit="hidden"
        className="relative mx-auto flex w-full flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat py-0 md:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
                  <div className="mx-auto flex w-full flex-col items-center justify-center gap-5 p-8 sm:p-12 lg:p-16 text-center text-textmain">
          <h4 className="flex items-center justify-center gap-5 text-xl font-bold uppercase lg:text-2xl text-brand">
            Invista na saúde e felicidade do seu companheiro
          </h4>
          <p className="text-sm font-light md:text-base xl:text-lg">
            Planos de assinatura que proporcionam uma abordagem abrangente para
            garantir que seu companheiro peludo receba cuidados essenciais.
          </p>

          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex flex-col items-center justify-center">
              <span className="w-1/2 rounded-t-2xl bg-brand p-2 font-bold text-white">
                Power BASIC
              </span>

              <div className="flex min-h-[30rem] w-full max-w-sm flex-col items-center justify-center gap-4 rounded-t-2xl bg-neutralbg p-8 text-textmain">
                {plansBasic.map((basic, index) => (
                  <div key={index}>
                    <h4 className="font-bold">{basic.title}</h4>
                    <p className="text-sm font-light">{basic.text}</p>
                    <Divider className="mt-3" />
                  </div>
                ))}
                <span className="w-full text-3xl font-bold text-brand">R$59,99/mês</span>
              </div>

              <Button
                className="mt-5 h-14 w-full text-base font-medium uppercase bg-brand text-white hover:bg-highlight"
                endContent={<TbShieldCheck size={30} className="ml-2" />}
              >
                Obter Vantagens
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="w-1/2 rounded-t-2xl bg-brand p-2 font-bold text-white">
                Power PRO
              </span>

              <div className="flex min-h-[30rem] w-full max-w-sm flex-col items-center justify-center gap-4 rounded-t-2xl bg-neutralbg p-8 text-textmain">
                {plansPro.map((pro, index) => (
                  <div key={index}>
                    <h4 className="font-bold">{pro.title}</h4>
                    <p className="text-sm font-light">{pro.text}</p>
                    <Divider className="mt-3" />
                  </div>
                ))}
                <span className="w-full text-3xl font-bold text-brand">R$99,99/mês</span>
              </div>

              <Button
                className="mt-5 h-14 w-full text-base font-medium uppercase bg-brand text-white hover:bg-highlight"
                endContent={<TbShieldCheck size={30} className="ml-2" />}
              >
                Obter Vantagens
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PlansSection;
