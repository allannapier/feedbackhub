                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive(child.href)
                              ? 'bg-indigo-100 text-indigo-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-3">{child.icon}</span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href!)
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User info */}
          {user && (
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="ml-3 flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 disabled:opacity-50"
                  title="Sign Out"
                >
                  🚪
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              ☰
            </button>
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              FeedbackHub
            </Link>
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.name || user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  🚪
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
