import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Plus, Edit } from "lucide-react";
import {
  getEmployeePermissions,
  getEmployeeRoles,
  createEmployeeRole,
  updateRolePermissions,
} from "../utlis/https";
import { toast } from "react-toastify";

export default function EmployeeRoles() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    permissions: [],
  });
  const [editingRole, setEditingRole] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch employee roles
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["employee-roles"],
    queryFn: () => getEmployeeRoles({ token }),
  });

  // Fetch employee permissions
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ["employee-permissions"],
    queryFn: () => getEmployeePermissions({ token }),
  });

  const roles = rolesData?.data || [];
  const rawPermissions = permissionsData?.data?.data || permissionsData?.data;
  const isGroupedPermissions =
    rawPermissions &&
    !Array.isArray(rawPermissions) &&
    typeof rawPermissions === "object";
  const groupedPermissions = isGroupedPermissions
    ? rawPermissions
    : { الصلاحيات: Array.isArray(rawPermissions) ? rawPermissions : [] };
  const flatPermissions = isGroupedPermissions
    ? Object.entries(groupedPermissions)
        .filter(
          ([category]) => typeof category === "string" && category.trim() !== ""
        )
        .map(([, perms]) => perms)
        .flat()
    : groupedPermissions["الصلاحيات"];

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createEmployeeRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-roles"]);
      toast.success("تم إضافة الدور بنجاح");
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating role:", error);
      toast.error("حدث خطأ أثناء إضافة الدور");
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-roles"]);
      toast.success("تم تحديث الدور بنجاح");
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      toast.error("حدث خطأ أثناء تحديث الدور");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      display_name: "",
      permissions: [],
    });
    setEditingRole(null);
    setIsFormOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      display_name: role.display_name,
      permissions: role.permissions?.map((p) => p.id) || [],
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.display_name ||
      formData.permissions.length === 0
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Convert permission IDs to permission names
    const permissionNames = formData.permissions
      .map((permissionId) => {
        const permission = flatPermissions.find((p) => p.id === permissionId);
        return permission?.name;
      })
      .filter(Boolean);

    if (editingRole) {
      // Update existing role
      updateRoleMutation.mutate({
        token,
        roleId: editingRole.id,
        permissions: permissionNames,
      });
    } else {
      // Create new role
      createRoleMutation.mutate({
        token,
        hospital_id: localStorage.getItem("hospital_id") || "1",
        name: formData.name,
        display_name: formData.display_name,
        permissions: permissionNames,
      });
    }
  };

  // if (!hasPermission("add-employees")) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  //       <div className="text-center">
  //         <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
  //           <svg
  //             className="h-8 w-8 text-red-600"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
  //             />
  //           </svg>
  //         </div>
  //         <h3 className="text-lg font-semibold text-gray-900 mb-2">
  //           غير مصرح لك
  //         </h3>
  //         <p className="text-gray-600 text-sm">
  //           ليس لديك صلاحية لإدارة الأدوار
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }
  console.log(rawPermissions);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>إضافة دور جديد</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأدوار</h1>
        </div>

        <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Roles List */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              الأدوار الموجودة
            </h2>

            {rolesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {role.display_name}
                      </h3>
                      <p className="text-sm text-gray-500">{role.name}</p>
                      <p className="text-xs text-gray-400">
                        {role.permissions?.length || 0} صلاحية
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditRole(role)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Form */}
          {isFormOpen && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingRole ? "تعديل الدور" : "إضافة دور جديد"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Name */}
                <div style={{ direction: "rtl" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الدور (Name)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={
                      createRoleMutation.isPending ||
                      updateRoleMutation.isPending
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="مثال: admin, doctor, nurse"
                  />
                </div>

                {/* Display Name */}
                <div style={{ direction: "rtl" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم المعروض (Display Name)
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) =>
                      handleInputChange("display_name", e.target.value)
                    }
                    required
                    disabled={
                      createRoleMutation.isPending ||
                      updateRoleMutation.isPending
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="مثال: مدير, طبيب, ممرض"
                  />
                </div>

                {/* Permissions */}
                <div style={{ direction: "rtl" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    الصلاحيات
                  </label>

                  {permissionsLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 bg-gray-200 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {Object.entries(groupedPermissions)
                        .filter(
                          ([category, perms]) =>
                            typeof category === "string" &&
                            category.trim() !== "" &&
                            Array.isArray(perms) &&
                            perms.length > 0
                        )
                        .map(([category, perms]) => {
                          return (
                            <div key={category} className="space-y-2">
                              <div className="inline-block text-sm font-semibold text-white bg-gradient-to-r from-[#33A9C7] to-[#3AAB95] rounded-md px-2 py-1">
                                {category}
                              </div>
                              <div className="space-y-1">
                                {perms.map((permission) => (
                                  <label
                                    key={permission.id}
                                    className="flex items-center space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions.includes(
                                        permission.id
                                      )}
                                      onChange={() =>
                                        handlePermissionToggle(permission.id)
                                      }
                                      disabled={
                                        createRoleMutation.isPending ||
                                        updateRoleMutation.isPending
                                      }
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">
                                        {permission.display_name ||
                                          permission.name}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {formData.permissions.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      تم اختيار {formData.permissions.length} صلاحية
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 space-x-reverse pt-4">
                  <button
                    type="submit"
                    disabled={
                      createRoleMutation.isPending ||
                      updateRoleMutation.isPending
                    }
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={20} />
                    <span>
                      {createRoleMutation.isPending ||
                      updateRoleMutation.isPending
                        ? "جاري الحفظ..."
                        : editingRole
                        ? "تحديث الدور"
                        : "إضافة الدور"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
