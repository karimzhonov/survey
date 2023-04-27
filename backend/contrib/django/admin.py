

class ReadOnlyAdminModelMixin:
    def has_change_permission(self, request, obj=None, *args, **kwargs) -> bool:
        return False
    
    def has_add_permission(self, request, *args, **kwargs) -> bool:
        return False
    
    def has_delete_permission(self, request, obj=None, *args, **kwargs) -> bool:
        return False