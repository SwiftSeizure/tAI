import React, { useEffect, useState } from "react";   
import UnitCard from "../components/UnitCard";
import { NavBar } from "../../shared/components/NavBar"; 
import Loading from "../../shared/components/Loading"; 
import { useCurrentUser } from "../../store/user-store";
import { useCurrentClass } from "../../store/class-store"; 
import { useUnit } from "../../store/unit-store";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../store/user-store";
import { useAllUnits, useUnitLoading, useUnitError } from "../../store/unit-store"; 
import DeleteModal from "../../shared/modals/DeleteModal";
import { deleteUnit } from "../services/delete-unit"; 
import { putPublishUnit } from "../services/put-publish-unit"; 
 

/**
 * TeacherStudentUnitPage 
 * This page displays the units associated with a specific class for both teachers and students.
 * It fetches unit data from the backend and renders a grid of `UnitCard` components.
 * 
 * Features:
 * - Fetches unit data based on the class ID.
 * - Displays a title card with the class name.
 * - Renders a grid of `UnitCard` components for each unit.
 */

const TeacherStudentUnitPage = () => {    

    // Retrieve class and user information from the location state
    const { currentClass } = useCurrentClass(); 
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const [state, { setCurrentUnit, fetchUnits } ] = useUnit();  
    const isAuthenticated = useIsAuthenticated(); 
    const { units } = useAllUnits();
    const { isLoading } = useUnitLoading();
    const { error } = useUnitError(); 

    // State for managing delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [currentDeleteUnitID, setCurrentDeleteUnitID] = useState(null);  
    const [currentDeleteUnitName, setCurrentDeleteUnitName] = useState(null); 

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]); 

    useEffect(() => {
        fetchUnits(currentClass.id);
    }, [currentClass.id]);


    const handleUnitSelect = async (unit) => {
        try { 
            if (!unit && user.role === "teacher") {
                navigate('/createunit');
                return;
            }
            await setCurrentUnit(unit.id);
            navigate('/modulepage');
        } 
        catch (error) {
            console.error('Error selecting unit:', error);
        }
    };  

    const handleOpenDeleteModal = (unit) => { 
        if (!unit) return;
        setCurrentDeleteUnitID(unit.id);
        setCurrentDeleteUnitName(unit.name);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUnit = async () => {
        try {
            await deleteUnit(currentDeleteUnitID);
            fetchUnits(currentClass.id);
        } 
        catch (error) {
            console.error('Error deleting unit:', error);
        }
    };
 
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };  

    const handlePublishUnit = async (unit) => {
        try { 
            console.log('Publishing unit:', unit);
            await putPublishUnit(unit.id);
            fetchUnits(currentClass.id);
        } 
        catch (error) {
            console.error('Error publishing unit:', error);
        }
    };

    /**
     * populateUnitCards
     * Generates a list of `UnitCard` components based on the fetched unit data.
     * Each `UnitCard` represents a unit associated with the class.
     */
    const populateUnitCards = () => {   
        if (isLoading) {
            return (
                <div className="col-span-full flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg text-gray-600 font-medium">Loading units...</p>
                    </div>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="col-span-full flex items-center justify-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Units</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            );
        }

        return(  
            <>  
            {Array.isArray(units) && units.map(unit => (  
                <UnitCard 
                    key={unit.id} 
                    unit={unit}  
                    onClick={handleUnitSelect} 
                    onClickDelete={handleOpenDeleteModal}
                    onClickPublish={handlePublishUnit}
                />
            ))}  
            {user.role === "teacher" 
                ? <UnitCard 
                    key={null} 
                    unit={null}  
                    onClick={handleUnitSelect} 
                    onClickDelete={handleOpenDeleteModal}
                />
                : null
            }
            </>
        )
    };

    return(  
        <>   
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 bg-[length:200%_200%]" style={{animation: 'gradient-shift 18s ease-in-out infinite'}}>

                {/* NavBar */}
                <NavBar 
                    title={currentClass?.name} 
                    classID={currentClass?.id}
                />

                {/* Main Content Container */}
                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    
                    {/* Section Header */}
                    <div className="mx-auto bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 w-fit">
                        <div className="flex flex-col items-center">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {`${currentClass?.name?.trim()}'s Units`}
                            </h2>
                            <p className="text-gray-600 text-center mt-2">
                                {user?.role === 'teacher' 
                                    ? 'Manage your units and course content' 
                                    : 'Access your learning units and materials'}
                            </p>
                        </div>
                    </div>

                    {/* Grid container for unit cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">      
                        {populateUnitCards()}   
                    </div>
                    
                    {/* Empty State - Only show if no units and not loading */}
                    {!isLoading && !error && Array.isArray(units) && units.length === 0 && (
                        <div className="col-span-full mt-12 text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {user?.role === 'teacher' ? 'No Units Yet' : 'No Units Available'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {user?.role === 'teacher' 
                                    ? 'Create your first unit to get started' 
                                    : 'Check back later for new units'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirmDelete={handleDeleteUnit}
                itemToDelete={currentDeleteUnitName}
            />
            
        </>
    );
} 

export default TeacherStudentUnitPage;