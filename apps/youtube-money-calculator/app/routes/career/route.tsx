import CareerBannerSection from "~/components/UI/Career/CareerBannerSection";
import CareerQuestionsSection from "~/components/UI/Career/CareerQuestionsSection";
import { careerQuestions } from "~/components/data/careerQuestions";

export default function Career() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <CareerBannerSection />
      <CareerQuestionsSection careerQuestions={careerQuestions} />
    </div>
  );
}
