import { Link } from 'react-router-dom';
import { PageContainer } from '../layout/PageContainer';
import { FullLogo } from '../svg/logos/FullLogo';
import { RegisterForm } from '../forms/RegisterForm';
import { IconChartBar, IconLink, IconTrendingUp } from '../svg/icons';

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 to-indigo-200">
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="flex space-x-16">
          <section className="mt-12 max-w-lg hidden lg:block">
            <FullLogo className="h-8" />
            <p className="mt-4 text-gray-600">
              Enter the new age of digital construction data. Use CompleteTabs as the source of
              truth for your next project!
            </p>
            <div className="mt-10 space-y-10">
              <div className="flex">
                <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-lg bg-indigo-400 text-gray-200">
                  <IconChartBar className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-700 leading-none">Granular Data</h3>
                  <p className="mt-1 text-gray-600 text-sm">
                    Supercharge your operations with location-specific data points.
                  </p>
                </div>
              </div>
              <div>
                <div className="flex">
                  <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-lg bg-indigo-400 text-gray-200">
                    <IconLink className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-700 leading-none">
                      Link Your Resources
                    </h3>
                    <p className="mt-1 text-gray-600 text-sm">
                      Hook your accounting and estimate information directly to project data points
                      as defined in the contract.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex">
                  <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-lg bg-indigo-400 text-gray-200">
                    <IconTrendingUp className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-700 leading-none">
                      Predict and Prepare
                    </h3>
                    <p className="mt-1 text-gray-600 text-sm">
                      Expose resource needs for upcoming work to be prepared for anything!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="p-12 space-y-8 w-full max-w-lg bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-700">Create your CompleteTabs account</h1>
            <RegisterForm />
            <p className="text-center text-sm">
              <span>Already have an account?</span>
              <Link to="/login" className="ml-1 text-indigo-500">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
